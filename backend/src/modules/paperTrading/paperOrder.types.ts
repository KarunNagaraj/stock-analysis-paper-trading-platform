export type PaperOrderSide = "BUY" | "SELL";

export type PaperOrderType = "MARKET";

export type PaperOrderStatus =
    | "PENDING"
    | "EXECUTED"
    | "CANCELLED"
    | "REJECTED";

export interface CreatePaperOrderInput {
    symbol: string;
    side: PaperOrderSide;
    quantity: number;
}

export interface PaperOrder {
    id: number;
    account_id: number;
    stock_id: number;
    side: PaperOrderSide;
    order_type: PaperOrderType;
    quantity: number;
    status: PaperOrderStatus;
    created_at: Date;
    executed_at: Date | null;
}
