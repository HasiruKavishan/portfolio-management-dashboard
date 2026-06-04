import { Request, Response, NextFunction } from "express";

export const getAllRates = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rates = {
      USD: 1.0,
      HKD: 7.7850,
      EUR: 0.9215,
      SGD: 1.3542,
    };

    res.json(Object.entries(rates).map(([currency, rate]) => ({ currency, rate })));
  } catch (error) {
    next(error);
  }
};