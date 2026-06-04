import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { findMe, userLogin, userRegister } from "../services/auth.service";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }


        const user = await userRegister({ name, email, password });

        return res.status(201).json({
            message: "User created successfully",
            userId: user.id,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const token = await userLogin({ email, password });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ message: "Login successful", token });
    } catch (error) {
        next(error);
    }
};

export const logout = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.userId as string;

        const user = await findMe(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.json({
            user,
        });
    } catch (error) {
        next(error)
    }
}
