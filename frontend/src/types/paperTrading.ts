export interface PaperAccount {
    id: number;
    user_id: number;
    initial_balance: string;
    cash_balance: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePaperAccountInput {
    initialBalance: number;
}