import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

authRoutes.get("/me", authMiddleware, me);

export default authRoutes;