import type { Request, Response } from "express";
import { getPortfolio } from "./paperPortfolio.service.js";

export async function getPaperPortfolio(
    req: Request,
    res: Response
) {
    try {
        if (!req.user) {
            res.status(401).json({
                error: "Authentication required",
            });
            return;
        }

        const portfolio = await getPortfolio(req.user.id);

        res.status(200).json(portfolio);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to retrieve portfolio";

        console.error("Failed to retrieve portfolio:", error);

        if (message === "Paper account not found") {
            res.status(404).json({
                error: message,
            });
            return;
        }

        res.status(500).json({
            error: "Failed to retrieve portfolio",
        });
    }
}