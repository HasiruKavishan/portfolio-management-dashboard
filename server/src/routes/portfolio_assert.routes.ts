import express from "express";
import { getPortfolioAsserts } from "../controllers/portfolio_assert.controller";

const router = express.Router();

router.get("/:portfolioId", getPortfolioAsserts);

export default router;