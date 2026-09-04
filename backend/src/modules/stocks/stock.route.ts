import { Router } from "express";
import {
  getAllStocks,
  searchStocks,
  getStockBySymbol,
} from "./stock.controller.js";

const router = Router();

router.get("/search", searchStocks);
router.get("/:symbol", getStockBySymbol);
router.get("/", getAllStocks);

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