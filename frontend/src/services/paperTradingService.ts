import api from "./api";
import type { PaperAccount, CreatePaperAccountInput } from "../types/paperTrading";

export async function getPaperAccount(): Promise<PaperAccount> {
    const response = await api.get<PaperAccount>("/paper/account");

    return response.data;
}

export async function createPaperAccount(
    input: CreatePaperAccountInput
): Promise<PaperAccount> {
    const response = await api.post<PaperAccount>(
        "/paper/account",
        input
    );

    return response.data;
}

export async function resetPaperAccount(
    input: CreatePaperAccountInput
): Promise<PaperAccount> {
    const response = await api.post<PaperAccount>(
        "/paper/account/reset",
        input
    );

    return response.data;
}