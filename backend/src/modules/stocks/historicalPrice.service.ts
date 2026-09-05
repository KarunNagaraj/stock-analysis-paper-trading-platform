import { getHistoricalPrices } from "./historicalPrice.repository.js";

export async function getHistoricalPricesService(
  symbol: string,
  from?: string,
  to?: string
) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    throw new Error("Stock symbol is required");
  }

  if (from && to && from > to) {
    throw new Error("Invalid date range");
  }

  return await getHistoricalPrices(
    normalizedSymbol,
    from,
    to
  );
}