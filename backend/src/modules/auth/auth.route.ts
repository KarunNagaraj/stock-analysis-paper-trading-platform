import { Router } from "express";
import {
    register,
    login,
    me,
} from "./auth.controller";
import { authenticateToken } from "./auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticateToken, me);

export default authRouter;