import { CreatePaperAccountInput } from "./paperAccount.types";

const MAX_INITIAL_BALANCE = 100_000_000;

export function validateCreatePaperAccountInput(
    input: CreatePaperAccountInput
): void {
    if (
        typeof input.initialBalance !== "number" ||
        !Number.isFinite(input.initialBalance)
    ) {
        throw new Error("Initial balance must be a valid number");
    }

    if (input.initialBalance <= 0) {
        throw new Error("Initial balance must be greater than zero");
    }

    if (input.initialBalance > MAX_INITIAL_BALANCE) {
        throw new Error(
            `Initial balance cannot exceed ${MAX_INITIAL_BALANCE}`
        );
    }

    if (
        Math.round(input.initialBalance * 100) !==
        input.initialBalance * 100
    ) {
        throw new Error(
            "Initial balance can have at most two decimal places"
        );
    }
}