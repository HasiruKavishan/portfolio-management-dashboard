import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4400',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server running 🚀" });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/test", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated..." });
});

// Handle the errors properly
app.use(errorMiddleware);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();