export interface PaperAccount {
    id: number;
    user_id: number;
    initial_balance: string; //initial balance is a string because mysql12 returns decimal values as strings. We can convert to number in the service layer if needed.
    cash_balance: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePaperAccountInput {
    initialBalance: number;
}