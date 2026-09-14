import {
    createPaperAccount,
    findPaperAccountByUserId,
    resetPaperAccount,
} from "./paperAccount.repository";

import {
    CreatePaperAccountInput,
    PaperAccount,
} from "./paperAccount.types";

import { validateCreatePaperAccountInput } from "./paperAccount.validation";

export async function createAccount(
    userId: number,
    input: CreatePaperAccountInput
): Promise<PaperAccount> {
    validateCreatePaperAccountInput(input);

    const existingAccount = await findPaperAccountByUserId(userId);

    if (existingAccount) {
        throw new Error("Paper trading account already exists");
    }

    return createPaperAccount(userId, input.initialBalance);
}

export async function getAccount(
    userId: number
): Promise<PaperAccount | null> {
    return findPaperAccountByUserId(userId);
}

export async function resetAccount(
    userId: number,
    input: CreatePaperAccountInput
): Promise<PaperAccount> {
    validateCreatePaperAccountInput(input);

    const existingAccount = await findPaperAccountByUserId(userId);

    if (!existingAccount) {
        throw new Error("Paper trading account does not exist");
    }

    const account = await resetPaperAccount(
        userId,
        input.initialBalance
    );

    if (!account) {
        throw new Error("Failed to reset paper trading account");
    }

    return account;
}