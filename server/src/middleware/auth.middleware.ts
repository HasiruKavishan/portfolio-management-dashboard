import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET as string) as { userId: string };

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};