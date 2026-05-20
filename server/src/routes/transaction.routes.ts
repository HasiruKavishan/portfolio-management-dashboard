import express from "express";
import { createTransaction, getPortfolioTransactions, updateTransaction } from "../controllers/transaction.controller";

const router = express.Router();

router.post("/", createTransaction);

router.put("/:transactionId", updateTransaction);

router.get("/portfolio/:portfolioId", getPortfolioTransactions);

export default router;