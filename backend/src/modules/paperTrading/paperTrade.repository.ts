import pool from "../../database/db.js";
import type {
    PoolConnection,
    ResultSetHeader,
    RowDataPacket,
} from "mysql2/promise";
import type { PaperOrderSide } from "./paperOrder.types.js";

interface PaperTradeRow extends RowDataPacket {
    id: number;
    account_id: number;
    order_id: number;
    stock_id: number;
    side: PaperOrderSide;
    quantity: number;
    execution_price: number;
    realized_pnl: number | null;
    executed_at: Date;
}

export async function createTrade(
    connection: PoolConnection,
    accountId: number,
    orderId: number,
    stockId: number,
    side: PaperOrderSide,
    quantity: number,
    executionPrice: number,
    realizedPnl: number | null = null
): Promise<number> {
    const [result] = await connection.execute<ResultSetHeader>(
        `
        INSERT INTO paper_trades (
            account_id,
            order_id,
            stock_id,
            side,
            quantity,
            execution_price,
            realized_pnl
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            accountId,
            orderId,
            stockId,
            side,
            quantity,
            executionPrice,
            realizedPnl,
        ]
    );

    return result.insertId;
}

export async function getTradesByAccount(
    accountId: number
): Promise<PaperTradeRow[]> {
    const [rows] = await pool.execute<PaperTradeRow[]>(
        `
        SELECT
            id,
            account_id,
            order_id,
            stock_id,
            side,
            quantity,
            execution_price,
            realized_pnl,
            executed_at
        FROM paper_trades
        WHERE account_id = ?
        ORDER BY executed_at DESC
        `,
        [accountId]
    );

    return rows;
}
