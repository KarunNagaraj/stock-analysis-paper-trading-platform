import { Router } from "express";
import { getScreenerDateRangeController, getScreenerResults } from "./screener.controller.js";

const router = Router();

router.get("/", getScreenerResults);
router.get("/date-range", getScreenerDateRangeController);

export default router;
/*GET /api/screener
       │
       ▼
screener.route.ts
       │
       ▼
getScreenerResults()
       │
       ▼
validateScreenerParams()
       │
       ▼
runScreener()
       │
       ▼
screener.repository.ts
       │
       ▼
MySQL*/