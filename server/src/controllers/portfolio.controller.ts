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
        transactions: {
          orderBy: { id: "desc" },
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

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId: req.userId,
      },
    });

    if (!portfolio) {
      return res.status(403).json({ message: "Access denied" });
    }

    const [portfolioAssets, transactions, assets] = await Promise.all([
      prisma.portfolioAsset.findMany({ where: { portfolioId } }),
      prisma.transaction.findMany({ where: { portfolioId } }),
      prisma.asset.findMany(),
    ]);

    const assetMap = new Map(assets.map(a => [a.id, a]));

    let totalValue = 0;
    let totalCost = 0;

    const breakdown = portfolioAssets.map((pa) => {
      const asset = assetMap.get(pa.assetId);

      const assetTx = transactions.filter(
        t => t.assetId === pa.assetId && t.transactionType === "BUY"
      );

      const buyCost = assetTx.reduce(
        (sum, t) =>
          sum + Number(t.quantity) * Number(t.pricePerShare),
        0
      );

      const quantity = Number(pa.quantity);
      const avgBuyPrice = quantity ? buyCost / quantity : 0;

      const currentPrice = Number(asset?.currentPrice || 0);

      const unrealizedPnL =
        (currentPrice - avgBuyPrice) * quantity;

      const value = currentPrice * quantity;

      totalValue += value;
      totalCost += buyCost;

      return {
        assetId: pa.assetId,
        symbol: asset?.symbol,
        name: asset?.name,
        quantity,
        avgBuyPrice,
        currentPrice,
        value,
        unrealizedPnL,
      };
    });

    const totalPnL = totalValue - totalCost;

    return res.json({
      totalValue,
      totalCost,
      totalPnL,
      roi: totalCost ? (totalPnL / totalCost) * 100 : 0,
      assets: breakdown,
    });
  } catch (err) {
    next(err);
  }
};