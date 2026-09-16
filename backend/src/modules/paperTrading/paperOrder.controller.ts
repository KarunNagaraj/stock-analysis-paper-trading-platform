import type { Request, Response } from "express";
import { placePaperOrder } from "./paperOrder.service.js";
import type { CreatePaperOrderInput } from "./paperOrder.types.js";

export async function createPaperOrder(
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

        const input = req.body as CreatePaperOrderInput;
        const result = await placePaperOrder(
            req.user.id,
            input
        );

        res.status(201).json(result);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to place paper order";

        console.error("Failed to place paper order:", error);

        const clientErrors = [
            "Order data is required",
            "Valid stock symbol is required",
            "Side must be BUY or SELL",
            "Quantity must be a positive integer",
            "Paper account not found",
            "Paper trading account not found",
            "Stock not found",
            "Stock does not have a provider symbol",
            "Market data provider symbol not configured",
            "Insufficient cash balance",
            "Position not found",
            "No position found",
            "Insufficient shares",
            "Cannot sell",
        ];

        const isClientError = clientErrors.some((errorMessage) =>
            message.includes(errorMessage)
        );

        res.status(isClientError ? 400 : 500).json({
            error: message,
        });
    }
}
