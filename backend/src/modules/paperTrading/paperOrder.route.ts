import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import {
        createPaperOrder,
        getPaperOrders,
        getPaperTrades,
        getPaperPositions,
} from "./paperOrder.controller";

const paperOrderRouter = Router();

paperOrderRouter.post(
    "/orders",
    authenticateToken,
    createPaperOrder
);

paperOrderRouter.get(
        "/orders",
        authenticateToken,
        getPaperOrders
);

paperOrderRouter.get(
        "/trades",
        authenticateToken,
        getPaperTrades
);

paperOrderRouter.get(
        "/positions",
        authenticateToken,
        getPaperPositions
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
/*                    /api/paper
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
     account           orders            trades
        │                │                 │
   GET account       GET orders       GET trades
   POST account      POST orders
   POST reset
                         │
                         │
                     positions
                         │
                    GET positions*/