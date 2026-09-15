// These are application-owned models that keep Yahoo-specific response shapes out of the rest of the codebase.
export interface MarketQuote {
    symbol: string;
    price: number;
    dayHigh: number | null;
    dayLow: number | null;
    previousClose: number | null;
    volume: number | null;
}

// One complete daily OHLCV candle in the format used by our application.
export interface HistoricalPricePoint {
    tradingDate: string;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    closePrice: number;
    volume: number | null;
}
