import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import {
    createPaperAccount,
    getPaperAccount,
    resetPaperAccount,
} from "./paperAccount.controller";

const paperAccountRouter = Router();

paperAccountRouter.get(
    "/account",
    authenticateToken,
    getPaperAccount
);

paperAccountRouter.post(
    "/account",
    authenticateToken,
    createPaperAccount
);

paperAccountRouter.post(
    "/account/reset",
    authenticateToken,
    resetPaperAccount
);

export default paperAccountRouter;