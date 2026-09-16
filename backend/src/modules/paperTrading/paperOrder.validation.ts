import { CreatePaperOrderInput } from "./paperOrder.types";

export function validateCreatePaperOrder(
    input: CreatePaperOrderInput
): void {
    if (!input) {
        throw new Error("Order data is required");
    }

    if (!input.symbol || typeof input.symbol !== "string") {
        throw new Error("Valid stock symbol is required");
    }

    if (input.side !== "BUY" && input.side !== "SELL") {
        throw new Error("Side must be BUY or SELL");
    }

    if (
        !Number.isInteger(input.quantity) ||
        input.quantity <= 0
    ) {
        throw new Error("Quantity must be a positive integer");
    }
}
