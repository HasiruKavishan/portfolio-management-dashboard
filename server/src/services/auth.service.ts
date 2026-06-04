import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import jwt from 'jsonwebtoken'
import { env } from "../config/env";


interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

export const userRegister = async ({ name, email, password }: RegisterData) => {

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, email, passwordHash },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}

export const userLogin = async ({ email, password }: LoginData) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return jwt.sign({ userId: user.id }, env.JWT_SECRET as string, { expiresIn: "1d" });
}

export const findMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
}