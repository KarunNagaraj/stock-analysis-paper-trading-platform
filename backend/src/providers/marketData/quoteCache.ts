import type { MarketQuote } from "./marketData.types.js";

interface CachedQuote {
    quote: MarketQuote;
    expiresAt: number;
}

const cache = new Map<string, CachedQuote>();

const CACHE_DURATION = 60 * 1000; // 60 seconds

export function getCachedQuote(
    providerSymbol: string
): MarketQuote | null {
    const cached = cache.get(providerSymbol);

    if (!cached) {
        return null;
    }

    if (Date.now() >= cached.expiresAt) {
        cache.delete(providerSymbol);
        return null;
    }

    return cached.quote;
}

export function setCachedQuote(
    providerSymbol: string,
    quote: MarketQuote
): void {
    cache.set(providerSymbol, {
        quote,
        expiresAt:
            Date.now() + CACHE_DURATION,
    });
}
/* This module provides a simple in-memory cache for market quotes.
The cache stores quotes for a specified duration (60 seconds in this case).
The getCachedQuote function retrieves a quote from the cache if it exists and is still valid.
The setCachedQuote function adds or updates a quote in the cache with an expiration time.
The cache is used by yahooFinanceProvider */