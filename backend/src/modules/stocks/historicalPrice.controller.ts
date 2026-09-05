import { type Request, type Response } from "express";
import { getHistoricalPricesService } from "./historicalPrice.service.js";

export async function getHistoricalPrices(
  req: Request,
  res: Response
) {
  try {
    const symbol = req.params.symbol;

    if (!symbol) {
      res.status(400).json({
        error: "Stock symbol is required",
      });
      return;
    }

    const from =
      typeof req.query.from === "string"
        ? req.query.from
        : undefined;

    const to =
      typeof req.query.to === "string"
        ? req.query.to
        : undefined;

    const prices = await getHistoricalPricesService(
      symbol,
      from,
      to
    );

    res.json(prices);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid date range"
    ) {
      res.status(400).json({
        error: error.message,
      });
      return;
    }

    console.error(
      "Failed to retrieve historical prices:",
      error
    );

    res.status(500).json({
      error: "Failed to retrieve historical prices",
    });
  }
}