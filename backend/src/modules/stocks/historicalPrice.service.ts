import {
  getHistoricalPrices,
  getStockHistoryStatus,
  insertHistoricalPrices,
} from "./historicalPrice.repository.js";

import marketDataProvider from "../../providers/marketData/marketData.provider.instance.js";

export async function getHistoricalPricesService(
  symbol: string,
  from?: string,
  to?: string
) {
  const normalizedSymbol = symbol
    .trim()
    .toUpperCase();

  if (from && to && from > to) {
    throw new Error(
      "'from' date cannot be after 'to' date"
    );
  }

  const stock =
    await getStockHistoryStatus(
    normalizedSymbol,
  );

  if (!stock) {
    throw new Error("Stock not found");
  }

  if (!stock.provider_symbol) {
    throw new Error(
      "Market data provider symbol not configured"
    );
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  let syncFrom: string;

  if (stock.latest_date) {
    const latestDate =
      new Date(stock.latest_date);

    latestDate.setDate(
      latestDate.getDate() + 1
    );

    syncFrom = latestDate
      .toISOString()
      .split("T")[0];
  } else {
    syncFrom = from ?? "2021-01-01";
  }

  if (syncFrom <= today) {
    const historicalPrices =
      await marketDataProvider.getHistoricalPrices(
        stock.provider_symbol,
        syncFrom,
        today
      );

    if (historicalPrices.length > 0) {
      await insertHistoricalPrices(
        stock.id,
        historicalPrices
      );
    }
  }

  return await getHistoricalPrices(
    normalizedSymbol,
    from,
    to
  );
}