import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("register")
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Post("login")
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response,) {
        const { token } = await this.authService.login(dto)
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return { message: 'Login successful' };
    }

    @Post('logout')
    logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        })

        return { message: 'Logged out successfully' };
    }
}
