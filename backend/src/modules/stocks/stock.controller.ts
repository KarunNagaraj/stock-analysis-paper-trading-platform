import { type Request, type Response } from "express";
import {
  getAllStocksService,
  searchStocksService,
  getStockBySymbolService,
} from "./stock.service.js";

export async function getAllStocks(
  req: Request,
  res: Response
){
  try {
    const stocks = await getAllStocksService();
    res.json(stocks);
  } catch (error) {
    console.error("Failed to retrieve stocks:", error);
    res.status(500).json({ error: "Failed to retrieve stocks" });
  }
}

export async function searchStocks(
  req: Request,
  res: Response
) {
  try {
    const searchTerm = req.query.q;

    if (typeof searchTerm !== "string" || searchTerm.trim() === "") {
      res.status(400).json({
        error: "Search query is required",
      });
      return;
    }

    const stocks = await searchStocksService(searchTerm.trim());

    res.json(stocks);
  } catch (error) {
    console.error("Failed to search stocks:", error);

    res.status(500).json({
      error: "Failed to search stocks",
    });
  }
}

export async function getStockBySymbol(
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

    const stock = await getStockBySymbolService(symbol);

    res.json(stock);
  } catch (error) {
    console.error("Failed to retrieve stock:", error);

    res.status(404).json({
      error: "Stock not found",
    });
  }
}