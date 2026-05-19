import { NextFunction, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const addInvestment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { portfolioId, assetId, quantity } = req.body;

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

    const investment = await prisma.portfolioAsset.create({
      data: {
        portfolioId,
        assetId,
        quantity,
      },
    });

    res.status(201).json(investment);
  } catch (error) {
    next(error);
  }
};

export const updateInvestment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const investmentId = req.params.investmentId as string;
    const { quantity } = req.body;

    const investment = await prisma.portfolioAsset.findFirst({
      where: {
        id: investmentId,
        portfolio: {
          userId: req.userId,
        },
      },
    });

    if (!investment) {
      return res.status(403).json({
        message: "Access denied or investment not found",
      });
    }

    const updatedInvestment =
      await prisma.portfolioAsset.update({
        where: {
          id: investmentId,
        },
        data: {
          quantity,
        },
      });

    res.json(updatedInvestment);
  } catch (error) {
    next(error);
  }
};