import pool from "../../database/db.js";
import type {
    PoolConnection,
    ResultSetHeader,
    RowDataPacket,
} from "mysql2/promise";

export interface PaperPosition {
    id: number;
    account_id: number;
    stock_id: number;
    quantity: number;
    average_price: number;
    updated_at: Date;
}

interface PaperPositionRow extends RowDataPacket, PaperPosition {}

export async function getPosition(
    accountId: number,
    stockId: number
): Promise<PaperPosition | null> {
    const [rows] = await pool.execute<PaperPositionRow[]>(
        `
        SELECT
            id,
            account_id,
            stock_id,
            quantity,
            average_price,
            updated_at
        FROM paper_positions
        WHERE account_id = ?
            AND stock_id = ?
        LIMIT 1
        `,
        [accountId, stockId]
    );

    return rows.length > 0 ? rows[0] : null;
}

export async function getPositionsByAccount(
    accountId: number
): Promise<PaperPosition[]> {
    const [rows] = await pool.execute<PaperPositionRow[]>(
        `
        SELECT
            id,
            account_id,
            stock_id,
            quantity,
            average_price,
            updated_at
        FROM paper_positions
        WHERE account_id = ?
        ORDER BY updated_at DESC
        `,
        [accountId]
    );

    return rows;
}

export async function createPosition(
    connection: PoolConnection,
    accountId: number,
    stockId: number,
    quantity: number,
    averagePrice: number
): Promise<number> {
    const [result] = await connection.execute<ResultSetHeader>(
        `
        INSERT INTO paper_positions (
            account_id,
            stock_id,
            quantity,
            average_price
        )
        VALUES (?, ?, ?, ?)
        `,
        [accountId, stockId, quantity, averagePrice]
    );

    return result.insertId;
}

export async function updatePosition(
    connection: PoolConnection,
    positionId: number,
    quantity: number,
    averagePrice: number
): Promise<void> {
    await connection.execute(
        `
        UPDATE paper_positions
        SET
            quantity = ?,
            average_price = ?
        WHERE id = ?
        `,
        [quantity, averagePrice, positionId]
    );
}

export async function deletePosition(
    connection: PoolConnection,
    positionId: number
): Promise<void> {
    await connection.execute(
        `
        DELETE FROM paper_positions
        WHERE id = ?
        `,
        [positionId]
    );
}
/*POST /paper/orders
        │
        ▼
validate input
        │
        ▼
find user's account
        │
        ▼
find INFY in stocks
        │
        ▼
get provider_symbol
        │
        ▼
marketDataProvider.getQuote()
        │
        ▼
Yahoo Finance
        │
        ▼
executionPrice = ₹1,520
        │
        ▼
calculate 1,520 × quantity
        │
        ▼
check cash
        │
        ▼
BEGIN TRANSACTION
        │
        ├── create order
        ├── create/update position
        ├── create trade
        ├── deduct cash
        └── mark order EXECUTED
        │
        ▼
COMMIT*/