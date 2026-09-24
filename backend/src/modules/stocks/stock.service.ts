
//The repository knows how to talk to the database.The service knows what the application should do with that data like filtering etc.
import {
    getAllStocks,
    searchStocks,
    getStockBySymbol,
} from "./stock.repository.js";

import marketDataProvider from "../../providers/marketData/marketData.provider.instance.js";

export async function getAllStocksService() {
    return await getAllStocks();
}

export async function searchStocksService(searchTerm: string) {
    return await searchStocks(searchTerm);
}

export async function getStockBySymbolService(
    symbol: string
) {
    const normalizedSymbol = symbol
        .trim()
        .toUpperCase();

    const stocks = (await getStockBySymbol(normalizedSymbol)) as any[];

    if (stocks.length === 0) {
        throw new Error("Stock not found");
    }

    const stock = stocks[0] as any;

    if (!stock.provider_symbol) {
        throw new Error(
            "Market data provider symbol not configured"
        );
    }

    const quote =
        await marketDataProvider.getQuote(
            stock.provider_symbol
        );

    return {
        id: stock.id,
        symbol: stock.symbol,
        company_name: stock.company_name,
        exchange: stock.exchange,
        sector: stock.sector,
        industry: stock.industry,
        quote: {
            price: quote.price,
            dayHigh: quote.dayHigh,
            dayLow: quote.dayLow,
            previousClose: quote.previousClose,
            volume: quote.volume,
        },
    };
}
/* The stocks are retrieved from the database, then the provider symbol is
given to the market data provider to get the current quote. 
The quote is then added to the stock information and returned. */