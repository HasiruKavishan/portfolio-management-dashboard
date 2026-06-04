import { NextFunction, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { createPortfolioService, getPortfolioByIdService, getProfileSummaryService, getUserPortfoliosService } from "../services/portfolio.service";

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

    const portfolio = await createPortfolioService(req.userId as string, portfolioName)

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

    const portfolios = await getUserPortfoliosService(req.userId as string)

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
    const userId = req.userId as string;

    const portfolio = await getPortfolioByIdService(userId, portfolioId);

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

export const getPortfolioSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const portfolioId = req.params.portfolioId as string;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const summary = await getProfileSummaryService(req.userId as string, portfolioId);

    return res.json(summary);
  } catch (err) {
    next(err);
  }
};