import YahooFinance from "yahoo-finance2";

import type {
    MarketQuote,
    HistoricalPricePoint,
} from "./marketData.types.js";

import type { MarketDataProvider } from "./marketData.provider.js";

import {
    getCachedQuote,
    setCachedQuote,
} from "./quoteCache.js";

// This is the Yahoo Finance client object created from the library's class.
const yahooFinance = new YahooFinance({
    suppressNotices: ["yahooSurvey"],
});

// This class adapts Yahoo Finance to the provider contract used by our application.
export class YahooFinanceProvider implements MarketDataProvider {
    async getQuote(providerSymbol: string): Promise<MarketQuote> {
        const cachedQuote =
            getCachedQuote(providerSymbol);

        if (cachedQuote) {
            
            return cachedQuote;
        }

        const quote = await yahooFinance.quote(providerSymbol);

        // A quote without a current price cannot be represented as a valid MarketQuote.
        if (!quote.regularMarketPrice) {
            throw new Error(
                `No current price available for ${providerSymbol}`
            );
        }

        const marketQuote: MarketQuote = {
            symbol: providerSymbol,
            price: quote.regularMarketPrice,
            dayHigh: quote.regularMarketDayHigh ?? null,
            dayLow: quote.regularMarketDayLow ?? null,
            previousClose: quote.regularMarketPreviousClose ?? null,
            volume: quote.regularMarketVolume ?? null,
        };

        setCachedQuote(providerSymbol, marketQuote);

        return marketQuote;
    }

    async getHistoricalPrices(
        providerSymbol: string,
        from: string,
        to: string
    ): Promise<HistoricalPricePoint[]> {
        const result = await yahooFinance.chart(providerSymbol, {
            period1: from,
            period2: to,
            // Feature 11 needs daily candles rather than intraday data.
            interval: "1d",
        });

        // Discard incomplete candles, then map the remaining Yahoo fields to our model.
        return result.quotes
            .filter(
                (quote) =>
                    quote.open != null &&
                    quote.high != null &&
                    quote.low != null &&
                    quote.close != null
            )
            .map((quote) => ({
                tradingDate: new Date(quote.date)
                    .toISOString()
                    .split("T")[0],
                openPrice: quote.open!,
                highPrice: quote.high!,
                lowPrice: quote.low!,
                closePrice: quote.close!,
                volume: quote.volume ?? null,
            }));
    }
}
