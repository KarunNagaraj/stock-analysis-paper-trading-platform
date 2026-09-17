import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import { getPaperPortfolio } from "./paperPortfolio.controller";

const paperPortfolioRouter = Router();

paperPortfolioRouter.get(
    "/portfolio",
    authenticateToken,
    getPaperPortfolio
);

export default paperPortfolioRouter;