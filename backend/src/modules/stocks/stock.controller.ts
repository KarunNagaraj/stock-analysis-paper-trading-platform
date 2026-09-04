import { type Request, type Response } from "express";
import { getAllStocksService, searchStocksService} from "./stock.service.js";

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