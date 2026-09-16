import pool from "../../database/db.js";

import {
    getStockBySymbol,
} from "../stocks/stock.repository.js";

import marketDataProvider from "../../providers/marketData/marketData.provider.instance.js";

import {
    findPaperAccountByUserId,
} from "./paperAccount.repository.js";

import {
    createOrder,
    updateOrderStatus,
} from "./paperOrder.repository.js";

import {
    createTrade,
} from "./paperTrade.repository.js";

import {
    getPosition,
    createPosition,
    updatePosition,
    deletePosition,
} from "./paperPosition.repository.js";

import {
    validateCreatePaperOrder,
} from "./paperOrder.validation.js";

import type {
    CreatePaperOrderInput,
} from "./paperOrder.types.js";

interface PaperTradingStock {
    id: number;
    symbol: string;
    provider_symbol: string | null;
}

export async function placePaperOrder(
    userId: number,
    input: CreatePaperOrderInput
) {
    validateCreatePaperOrder(input);

    const account = await findPaperAccountByUserId(userId);

    if (!account) {
        throw new Error("Paper trading account not found");
    }

    const stocks = await getStockBySymbol(
        input.symbol.trim().toUpperCase()
    );
    const stock = (stocks as PaperTradingStock[])[0];

    if (!stock) {
        throw new Error("Stock not found");
    }

    if (!stock.provider_symbol) {
        throw new Error(
            "Market data provider symbol not configured"
        );
    }

    const quote = await marketDataProvider.getQuote(
        stock.provider_symbol
    );

    const executionPrice = quote.price;

    if (input.side === "BUY") {

    const totalCost = executionPrice * input.quantity;
    const cashBalance = Number(account.cash_balance);

    if (totalCost > cashBalance) {
        throw new Error("Insufficient cash balance");
    }

    const connection = await pool.getConnection();
    // A transaction is used to ensure all operations take place atomically, the same conncetion
    // is passed around to different services to ensure atomicity, rather than each service getting the connection from the pool which is what takes place normally.
    try {
        await connection.beginTransaction();

        const orderId = await createOrder(
            connection,
            account.id,
            stock.id,
            input
        );

        const existingPosition = await getPosition(
            account.id,
            stock.id
        );

        if (!existingPosition) {
            await createPosition(
                connection,
                account.id,
                stock.id,
                input.quantity,
                executionPrice
            );
        } else {
            const oldQuantity = existingPosition.quantity;
            const oldAveragePrice = Number(
                existingPosition.average_price
            );
            const newQuantity = oldQuantity + input.quantity;
            const newAveragePrice = (
                oldQuantity * oldAveragePrice +
                input.quantity * executionPrice
            ) / newQuantity;

            await updatePosition(
                connection,
                existingPosition.id,
                newQuantity,
                newAveragePrice
            );
        }

        await createTrade(
            connection,
            account.id,
            orderId,
            stock.id,
            "BUY",
            input.quantity,
            executionPrice,
            null
        );

        await connection.execute(
            `
            UPDATE paper_accounts
            SET cash_balance = cash_balance - ?
            WHERE id = ?
            `,
            [totalCost, account.id]
        );

        await updateOrderStatus(
            connection,
            orderId,
            "EXECUTED"
        );

        await connection.commit();

        return {
            orderId,
            symbol: stock.symbol,
            side: "BUY",
            quantity: input.quantity,
            executionPrice,
            totalCost,
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
    }

    const position = await getPosition(
        account.id,
        stock.id
    );

    if (!position) {
        throw new Error(
            `No position found for ${stock.symbol}`
        );
    }

    const accountId = account.id;
    const positionToSell = position;

    if (input.quantity > positionToSell.quantity) {
        throw new Error(
            `Cannot sell ${input.quantity} shares. You only own ${positionToSell.quantity}.`
        );
    }

    const saleValue = executionPrice * input.quantity;
    const averagePrice = Number(positionToSell.average_price);
    const realizedPnl = (
        executionPrice - averagePrice
    ) * input.quantity;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const orderId = await createOrder(
            connection,
            accountId,
            stock.id,
            input
        );

        await createTrade(
            connection,
            accountId,
            orderId,
            stock.id,
            "SELL",
            input.quantity,
            executionPrice,
            realizedPnl
        );

        const remainingQuantity =
            positionToSell.quantity - input.quantity;

        if (remainingQuantity === 0) {
            await deletePosition(
                connection,
                positionToSell.id
            );
        } else {
            await updatePosition(
                connection,
                positionToSell.id,
                remainingQuantity,
                averagePrice
            );
        }

        await connection.execute(
            `
            UPDATE paper_accounts
            SET cash_balance = cash_balance + ?
            WHERE id = ?
            `,
            [saleValue, accountId]
        );

        await updateOrderStatus(
            connection,
            orderId,
            "EXECUTED"
        );

        await connection.commit();

        return {
            orderId,
            symbol: stock.symbol,
            side: "SELL",
            quantity: input.quantity,
            executionPrice,
            totalValue: saleValue,
            realizedPnl,
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}