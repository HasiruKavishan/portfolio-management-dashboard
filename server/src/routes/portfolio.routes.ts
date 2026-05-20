import express from "express";
import { createPortfolio,
    getUserPortfolios,
    getPortfolioById,
    getPortfolioSummary
} from "../controllers/portfolio.controller";

const router = express.Router();

router.post("/", createPortfolio);

router.get("/", getUserPortfolios);

router.get("/:portfolioId", getPortfolioById);

router.get("/:portfolioId/summary", getPortfolioSummary);

export default router;