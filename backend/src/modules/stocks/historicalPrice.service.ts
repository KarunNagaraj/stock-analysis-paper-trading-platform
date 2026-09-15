import {
  getHistoricalPrices,
  getStockHistoryStatus,
  getAllStocksHistoryStatus,
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
    console.log(
      `Fetching historical prices for ${normalizedSymbol} from ${syncFrom} to ${today}`
    );
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

export async function syncAllStocksHistoricalPrices(
  today: string,
  concurrency = 5
) {
  const stocks = await getAllStocksHistoryStatus();

  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < stocks.length; i += concurrency) {
    const batch = stocks.slice(i, i + concurrency);

    await Promise.all( //promise all waits for each batch to finish before moving on to the next batch
      batch.map(async (stock) => {
        try {
          if (!stock.provider_symbol) {
            skippedCount++;
            console.log(
              `[SYNC] Skipped ${stock.symbol}: no provider symbol`
            );
            return;
          }

          let syncFrom: string;

          if (stock.latest_date) {
            /*
             * Start from the latest existing date rather than
             * the day after it.
             *
             * This allows today's OHLC row to be updated
             * while the market is still open.
             */
            syncFrom =
              typeof stock.latest_date === "string"
                ? stock.latest_date.slice(0, 10)
                : stock.latest_date
                    .toISOString()
                    .slice(0, 10);
          } else {
            syncFrom = "2021-01-01";
          }

          if (syncFrom > today) {
            skippedCount++;
            return;
          }

          console.log(
            `[SYNC] ${stock.symbol}: ${syncFrom} -> ${today}`
          );

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

          successCount++;
        } catch (error) {
          failedCount++;

          console.error(
            `[SYNC] Failed ${stock.symbol}:`,
            error
          );
        }
      })
    );
  }

  return {
    totalStocks: stocks.length,
    successCount,
    skippedCount,
    failedCount,
  };
}
 /* syncAllStocksHistoricalPrices does Get all stocks → process them in groups of 5 → for each stock, fetch its missing/current historical data → update MySQL → keep track of success/failure.
  Get all stocks

For every 5 stocks:
    Run these 5 at the same time

    For each stock:
        If no Yahoo symbol:
            skip

        Determine latest date

        If no historical data:
            start from 2021-01-01
        Otherwise:
            start from latest existing date

        If start date is after today:
            skip

        Ask Yahoo for:
            stock
            start date → today

        If Yahoo returned data:
            UPSERT it into MySQL

        Mark successful

        If anything failed:
            mark failed
            continue

Return statistics*/