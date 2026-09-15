import type {
    MarketQuote,
    HistoricalPricePoint,
} from "./marketData.types.js";

// This contract lets services request market data without knowing which provider supplies it.
export interface MarketDataProvider {
    getQuote(providerSymbol: string): Promise<MarketQuote>;

    getHistoricalPrices(
        providerSymbol: string,
        from: string,
        to: string
    ): Promise<HistoricalPricePoint[]>;
}
