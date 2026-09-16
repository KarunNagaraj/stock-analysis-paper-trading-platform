import pool from "../../database/db.js";
import type {
    PoolConnection,
    ResultSetHeader,
    RowDataPacket,
} from "mysql2/promise";

import type {
    CreatePaperOrderInput,
    PaperOrder,
} from "./paperOrder.types.js";

interface PaperOrderRow extends RowDataPacket, PaperOrder {}

export async function createOrder(
    connection: PoolConnection,
    accountId: number,
    stockId: number,
    input: CreatePaperOrderInput
): Promise<number> {
    const [result] = await connection.execute<ResultSetHeader>(
        `
        INSERT INTO paper_orders (
            account_id,
            stock_id,
            side,
            order_type,
            quantity,
            status
        )
        VALUES (?, ?, ?, 'MARKET', ?, 'PENDING')
        `,
        [
            accountId,
            stockId,
            input.side,
            input.quantity,
        ]
    );

    return result.insertId;
}

export async function getOrdersByAccount(
    accountId: number
): Promise<PaperOrder[]> {
    const [rows] = await pool.execute<PaperOrderRow[]>(
        `
        SELECT
            id,
            account_id,
            stock_id,
            side,
            order_type,
            quantity,
            status,
            created_at,
            executed_at
        FROM paper_orders
        WHERE account_id = ?
        ORDER BY created_at DESC
        `,
        [accountId]
    );

    return rows;
}

export async function updateOrderStatus(
    connection: PoolConnection,
    orderId: number,
    status: PaperOrder["status"]
): Promise<void> {
    await connection.execute(
        `
        UPDATE paper_orders
        SET
            status = ?,
            executed_at =
                CASE
                    WHEN ? = 'EXECUTED' THEN CURRENT_TIMESTAMP
                    ELSE executed_at
                END
        WHERE id = ?
        `,
        [status, status, orderId]
    );
}
