import express from "express";
import { createTransaction, getPortfolioTransactions } from "../controllers/transaction.controller";

const router = express.Router();

router.post("/", createTransaction);

router.get("/portfolio/:portfolioId", getPortfolioTransactions);

export default router;