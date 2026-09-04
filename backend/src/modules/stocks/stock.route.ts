import { Router } from "express";
import { getAllStocks, searchStocks } from "./stock.controller.js";

const router = Router();

router.get("/", getAllStocks);
router.get("/search", searchStocks);

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