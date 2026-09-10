import { Router } from "express";
import { getScreenerResults } from "./screener.controller.js";

const router = Router();

router.get("/", getScreenerResults);

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