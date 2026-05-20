import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authMiddleware } from "./middleware/auth.middleware";
import authRoutes from "./routes/auth.routes";
import portfolioRoutes from "./routes/portfolio.routes";
import transactionRoutes from "./routes/transaction.routes";
import assetRoutes from "./routes/asset.routes";
import portfolioAssertRoutes from "./routes/portfolio_assert.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.json({ message: "Server running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolios", authMiddleware, portfolioRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/portfolio-assets", authMiddleware, portfolioAssertRoutes);
app.use("/api/assets", assetRoutes);

app.get("/api/test", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated..." });
});

// error handler
app.use(errorMiddleware);

export default app;