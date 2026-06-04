import { prisma } from "../config/prisma";

export const createPortfolioService = async (userId: string, portfolioName: string) => {
    return await prisma.portfolio.create({
        data: {
            userId,
            portfolioName,
        },
    });
}

export const getUserPortfoliosService = async (userId: string) => {
    return await prisma.portfolio.findMany({
        where: {
            userId
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
}

export const getPortfolioByIdService = async (userId: string, portfolioId: string) => {
    return await prisma.portfolio.findFirst({
        where: {
            id: portfolioId,
            userId,
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
}

export const getProfileSummaryService = async (userId: string, portfolioId: string) => {

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId
      },
    });

    if (!portfolio) {
      throw new Error("Portfolio Not Found, Access Denied")
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

    return {
      totalValue,
      totalCost,
      totalPnL,
      roi: totalCost ? (totalPnL / totalCost) * 100 : 0,
      assets: breakdown,
    };

}