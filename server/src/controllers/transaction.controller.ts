import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createTransaction as createTransactionService,
  getPortfolioTransactions as getPortfolioTransactionsService,
  updateTransaction as updateTransactionService,
} from "../services/transaction.service";

export const createTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      portfolioId,
      assetId,
      transactionType,
      quantity,
      pricePerShare,
    } = req.body;

    const transaction = await createTransactionService(req, {
      portfolioId,
      assetId,
      transactionType,
      quantity,
      pricePerShare,
    });

    return res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const portfolioId = req.params.portfolioId as string;

    const transactions = await getPortfolioTransactionsService(req, portfolioId);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactionId = req.params.transactionId as string;
    const { quantity, pricePerShare, transactionType } = req.body;

    const transaction = await updateTransactionService(req, transactionId, {
      quantity,
      pricePerShare,
      transactionType,
    });

    return res.json({
      message: "Transaction updated",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};