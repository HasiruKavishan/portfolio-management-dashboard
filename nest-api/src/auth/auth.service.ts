import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { env } from 'process';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }


    async register(dto: RegisterDto) {
        const { name, email, password } = dto
        const existingUser = await this.prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            throw new Error("Email already exists")
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                passwordHash
            }
        })

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }

    async login(dto: LoginDto) {
        const { email, password } = dto

        const user = await this.prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error("Invalid credentials")
        }

        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash)

        if (!isPasswordMatch) {
            throw new Error("Invalid credentials")
        }

        return this.generateToken(user.id, user.email);
    }

    private generateToken(userId: string, email: string) {
        return {
            token: this.jwtService.sign({
                userId,
                email,
            }),
        };
    }
}
