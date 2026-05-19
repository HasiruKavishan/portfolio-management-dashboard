import { NextFunction, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTransaction = async (
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

    const {
      portfolioId,
      assetId,
      transactionType,
      quantity,
      pricePerShare
    } = req.body;

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId: req.userId,
      },
    });

    if (!portfolio) {
      return res.status(403).json({
        message: "Access denied to this portfolio",
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        portfolioId,
        assetId,
        transactionType,
        quantity,
        pricePerShare,
      },
    });

    res.status(201).json(transaction);
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

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId: req.userId,
      },
    });

    if (!portfolio) {
      return res.status(403).json({
        message: "Access denied to this portfolio",
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        portfolioId,
      },
      include: {
        asset: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

