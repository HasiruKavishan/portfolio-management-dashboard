import { NextFunction, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getPortfolioAsserts = async (
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

    const portfolioAsserts = await prisma.portfolioAsset.findMany({
      where: {
        portfolioId,
      },
      include: {
        asset: true,
      },
    });

    res.json(portfolioAsserts);
  } catch (error) {
    next(error);
  }
};

