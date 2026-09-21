import api from "./api";
import type { PaperAccount, CreatePaperAccountInput } from "../types/paperTrading";
import type { PaperPortfolio } from "../types/paperPortfolio.types";

export type PaperOrderSide = "BUY" | "SELL";

export type CreatePaperOrderInput = {
    symbol: string;
    side: PaperOrderSide;
    quantity: number;
};

export type PaperOrderResponse = {
    orderId: number;
    symbol: string;
    side: PaperOrderSide;
    quantity: number;
    executionPrice: number;
    totalValue: number;
};

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

export async function getPaperPortfolio(): Promise<PaperPortfolio> {
    const response = await api.get<PaperPortfolio>("/paper/portfolio");

    return response.data;
}

export async function placePaperOrder(
    input: CreatePaperOrderInput
): Promise<PaperOrderResponse> {
    const response = await api.post(
        "/paper/orders",
        input
    );

    return response.data as PaperOrderResponse;
}