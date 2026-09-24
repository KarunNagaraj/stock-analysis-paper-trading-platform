import { findPaperAccountByUserId } from "./paperAccount.repository.js";

import {
    getPositionsByAccount,
} from "./paperPosition.repository.js";

import {
    getTradesByAccount,
} from "./paperTrade.repository.js";

import {
    getStockById,
} from "../stocks/stock.repository.js";

import marketDataProvider from "../../providers/marketData/marketData.provider.instance.js";


export async function getPortfolio(userId: number) {

    // 1. Find the user's paper account
    const account = await findPaperAccountByUserId(userId);

    if (!account) {
        throw new Error("Paper account not found");
    }


    // 2. Get all currently open positions
    const positions = await getPositionsByAccount(account.id);


    // 3. Get all trades
    //    We use SELL trades to calculate realized P&L.
    const trades = await getTradesByAccount(account.id);

    const realizedPnl = trades.reduce((total, trade) => {
        return total + Number(trade.realized_pnl ?? 0);
    }, 0);


    // 4. Calculate the current value of every position
    const portfolioPositions = [];

    let investedValue = 0;
    let currentMarketValue = 0;


    for (const position of positions) {

        // position.stock_id -> stocks.id
        const rows = (await getStockById(position.stock_id)) as any[];

        if (!rows || rows.length === 0) {
            continue;
        }

        const stock = rows[0] as any;

        if (!stock.provider_symbol) {
            continue;
        }


        // Get the CURRENT market price
        const quote = await marketDataProvider.getQuote(
            stock.provider_symbol
        );


        const quantity = Number(position.quantity);
        const averagePrice = Number(position.average_price);
        const currentPrice = Number(quote.price);


        // What we originally paid
        const positionCost =
            averagePrice * quantity;


        // What the position is worth now
        const marketValue =
            currentPrice * quantity;


        // Current unrealized profit/loss
        const unrealizedPnl =
            marketValue - positionCost;


        investedValue += positionCost;
        currentMarketValue += marketValue;


        portfolioPositions.push({
            stockId: position.stock_id,
            symbol: stock.symbol,
            quantity,
            averagePrice,
            currentPrice,
            investedValue: positionCost,
            marketValue,
            unrealizedPnl,
        });
    }


    // 5. Account cash
    const cashBalance = Number(account.cash_balance);


    // 6. Total portfolio value
    const portfolioValue =
        cashBalance + currentMarketValue;


    // 7. Total unrealized P&L
    const unrealizedPnl =
        currentMarketValue - investedValue;


    // 8. Total P&L
    const totalPnl =
        realizedPnl + unrealizedPnl;


    // 9. Return relative to starting capital
    const initialBalance =
        Number(account.initial_balance);

    const returnPercentage =
        initialBalance > 0
            ? (totalPnl / initialBalance) * 100
            : 0;


    return {
        cashBalance,
        investedValue,
        currentMarketValue,
        portfolioValue,
        realizedPnl,
        unrealizedPnl,
        totalPnl,
        returnPercentage,
        positions: portfolioPositions,
    };
}