import { Router } from "express";
import {
  getAllStocks,
  searchStocks,
  getStockBySymbol,
} from "./stock.controller.js";
import { getHistoricalPrices } from "./historicalPrice.controller.js";

const router = Router();

router.get("/", getAllStocks);
router.get("/search", searchStocks);
router.get("/:symbol/history", getHistoricalPrices);
router.get("/:symbol", getStockBySymbol);

export default router;

/*req.query.q
    ↓
searchTerm
    ↓
searchStocksService(searchTerm)
    ↓
searchStocks(searchTerm)
    ↓
SQL*/