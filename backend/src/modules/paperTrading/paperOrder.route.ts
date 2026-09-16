import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import { createPaperOrder } from "./paperOrder.controller";

const paperOrderRouter = Router();

paperOrderRouter.post(
    "/orders",
    authenticateToken,
    createPaperOrder
);

export default paperOrderRouter;

/*
POST /api/paper/orders
        │
        ▼
paperOrder.route.ts
        │
        │ authenticateToken
        ▼
paperOrder.controller.ts
        │
        ▼
paperOrder.service.ts
        │
        ├── findPaperAccountByUserId()
        │
        ├── getStockBySymbol()
        │
        ├── marketDataProvider.getQuote()
        │
        ├── BEGIN TRANSACTION
        │
        ├── paper_orders
        ├── paper_positions
        ├── paper_trades
        ├── paper_accounts
        │
        └── COMMIT
        ▼
JSON response
*/
