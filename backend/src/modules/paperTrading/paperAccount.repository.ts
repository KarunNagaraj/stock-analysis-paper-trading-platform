import pool from "../../database/db";
import { PaperAccount } from "./paperAccount.types";

export async function createPaperAccount(
    userId: number,
    initialBalance: number
): Promise<PaperAccount> {
    const [result] = await pool.execute(
        `
        INSERT INTO paper_accounts (
            user_id,
            initial_balance,
            cash_balance
        )
        VALUES (?, ?, ?)
        `,
        [userId, initialBalance, initialBalance]
    );

    const insertResult = result as { insertId: number };

    const account = await findPaperAccountById(insertResult.insertId);

    if (!account) {
        throw new Error("Failed to retrieve created paper account");
    }

    return account;
}

export async function findPaperAccountByUserId(
    userId: number
): Promise<PaperAccount | null> {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            user_id,
            initial_balance,
            cash_balance,
            created_at,
            updated_at
        FROM paper_accounts
        WHERE user_id = ?
        `,
        [userId]
    );

    const accounts = rows as PaperAccount[];

    return accounts[0] ?? null;
}

export async function findPaperAccountById(
    accountId: number
): Promise<PaperAccount | null> {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            user_id,
            initial_balance,
            cash_balance,
            created_at,
            updated_at
        FROM paper_accounts
        WHERE id = ?
        `,
        [accountId]
    );

    const accounts = rows as PaperAccount[];

    return accounts[0] ?? null; //give the first matching account or null if none found. There should only be one account per user, but this is a safeguard.
}

export async function resetPaperAccount(
    userId: number,
    initialBalance: number
): Promise<PaperAccount | null> {
    await pool.execute(
        `
        UPDATE paper_accounts
        SET
            initial_balance = ?,
            cash_balance = ?
        WHERE user_id = ?
        `,
        [initialBalance, initialBalance, userId]
    );

    return findPaperAccountByUserId(userId);
}