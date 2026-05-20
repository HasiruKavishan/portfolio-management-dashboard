import { NextFunction, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { Prisma } from "@prisma/client";

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

    // 1. Check portfolio ownership
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

    // 2. Get current holding
    const portfolioAsset = await prisma.portfolioAsset.findFirst({
      where: {
        portfolioId,
        assetId,
      },
    });

    const currentQty = portfolioAsset?.quantity ?? new Prisma.Decimal(0);
    const changeQty = new Prisma.Decimal(quantity);

    let newQuantity: Prisma.Decimal;

    // 3. BUY logic
    if (transactionType === "BUY") {
      newQuantity = currentQty.add(changeQty);
    }

    // 4. SELL logic
    else if (transactionType === "SELL") {
      if (currentQty.lessThan(changeQty)) {
        return res.status(400).json({
          message: "Not enough assets to sell",
        });
      }

      newQuantity = currentQty.sub(changeQty);
    } else {
      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }

    // 5. Save transaction (history only)
    const transaction = await prisma.transaction.create({
      data: {
        portfolioId,
        assetId,
        transactionType,
        quantity: changeQty,
        pricePerShare,
      },
    });

    // 6. Update portfolio holdings
    await prisma.portfolioAsset.upsert({
      where: {
        portfolioId_assetId: {
          portfolioId,
          assetId,
        },
      },
      update: {
        quantity: newQuantity,
      },
      create: {
        portfolioId,
        assetId,
        quantity: newQuantity,
      },
    });

    return res.status(201).json({
      transaction,
    });
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

