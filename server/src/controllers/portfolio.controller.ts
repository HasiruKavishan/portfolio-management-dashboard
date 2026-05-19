import { NextFunction, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPortfolio = async (
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

    const { portfolioName } = req.body;

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: req.userId,
        portfolioName,
      },
    });

    res.status(201).json(portfolio);
  } catch (error) {
    next(error);
  }
};

export const getUserPortfolios = async (
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

    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        assets: {
          include: {
            asset: true,
          },
        },
      },
    });

    res.json(portfolios);
  } catch (error) {
    next(error);
  }
};

export const getPortfolioById = async (
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
      include: {
        assets: {
          include: {
            asset: true,
          },
        },
        transactions: {
          include: {
            asset: true,
          },
        },
      },
    });

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found",
      });
    }

    res.json(portfolio);
  } catch (error) {
    next(error);
  }
};