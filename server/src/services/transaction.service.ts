import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { Prisma } from "@prisma/client";

interface CreateTransactionData {
  portfolioId: string;
  assetId: string;
  transactionType: string;
  quantity: string | number;
  pricePerShare: string | number;
}

interface UpdateTransactionData {
  transactionType: string;
  quantity: string | number;
  pricePerShare: string | number;
}

const createHttpError = (message: string, statusCode: number) => {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
};

const ensurePortfolioOwnership = async (
  userId: string,
  portfolioId: string
) => {
  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id: portfolioId,
      userId,
    },
  });

  if (!portfolio) {
    throw createHttpError("Access denied to this portfolio", 403);
  }

  return portfolio;
};

export const createTransaction = async (
  req: AuthRequest,
  transactionData: CreateTransactionData
) => {
  const { portfolioId, assetId, transactionType, quantity, pricePerShare } =
    transactionData;

  if (!req.userId) {
    throw createHttpError("Unauthorized", 401);
  }

  await ensurePortfolioOwnership(req.userId, portfolioId);

  const portfolioAsset = await prisma.portfolioAsset.findFirst({
    where: {
      portfolioId,
      assetId,
    },
  });

  const currentQty = portfolioAsset?.quantity ?? new Prisma.Decimal(0);
  const changeQty = new Prisma.Decimal(quantity);

  let newQuantity: Prisma.Decimal;

  if (transactionType === "BUY") {
    newQuantity = currentQty.add(changeQty);
  } else if (transactionType === "SELL") {
    if (currentQty.lessThan(changeQty)) {
      throw createHttpError("Not enough assets to sell", 400);
    }

    newQuantity = currentQty.sub(changeQty);
  } else {
    throw createHttpError("Invalid transaction type", 400);
  }

  const transaction = await prisma.transaction.create({
    data: {
      portfolioId,
      assetId,
      transactionType,
      quantity: changeQty,
      pricePerShare,
    },
  });

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

  return transaction;
};

export const getPortfolioTransactions = async (
  req: AuthRequest,
  portfolioId: string
) => {
  if (!req.userId) {
    throw createHttpError("Unauthorized", 401);
  }

  await ensurePortfolioOwnership(req.userId, portfolioId);

  return prisma.transaction.findMany({
    where: {
      portfolioId,
      status: "ACTIVE",
    },
    include: {
      asset: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const updateTransaction = async (
  req: AuthRequest,
  transactionId: string,
  updateData: UpdateTransactionData
) => {
  const { transactionType, quantity, pricePerShare } = updateData;

  if (!req.userId) {
    throw createHttpError("Unauthorized", 401);
  }

  const existing = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
    },
  });

  if (!existing) {
    throw createHttpError("Transaction not found", 404);
  }

  await ensurePortfolioOwnership(req.userId, existing.portfolioId);

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: "REPLACED",
    },
  });

  const newTransaction = await prisma.transaction.create({
    data: {
      portfolioId: existing.portfolioId,
      assetId: existing.assetId,
      transactionType,
      quantity,
      pricePerShare,
      status: "ACTIVE",
    },
  });

  const allTransactions = await prisma.transaction.findMany({
    where: {
      portfolioId: existing.portfolioId,
      assetId: existing.assetId,
      status: "ACTIVE",
    },
  });

  let total = new Prisma.Decimal(0);

  for (const tx of allTransactions) {
    if (tx.transactionType === "BUY") {
      total = total.add(tx.quantity);
    } else {
      total = total.sub(tx.quantity);
    }
  }

  await prisma.portfolioAsset.upsert({
    where: {
      portfolioId_assetId: {
        portfolioId: existing.portfolioId,
        assetId: existing.assetId,
      },
    },
    update: {
      quantity: total,
    },
    create: {
      portfolioId: existing.portfolioId,
      assetId: existing.assetId,
      quantity: total,
    },
  });

  return newTransaction;
};
