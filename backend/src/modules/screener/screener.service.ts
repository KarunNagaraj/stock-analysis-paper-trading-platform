import {
  getPricesForDate,
  getPreviousTradingDate,
  getPricesBetweenDates,
  getHistoricalDateRange
} from "./screener.repository.js";

import type {
  ScreenerPeriod,
  ScreenerType,
} from "./screener.validation.js";

function calculatePercentageChange(
  startPrice: number,
  endPrice: number
) {
  return ((endPrice - startPrice) / startPrice) * 100;
}

function getWeekStart(date: string) {
  const currentDate = new Date(`${date}T00:00:00`);

  const day = currentDate.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  currentDate.setDate(currentDate.getDate() + difference);

  return currentDate.toISOString().slice(0, 10); //slice (0, 10) to get the date in YYYY-MM-DD format. The toISOString() method returns the date in ISO 8601 format, which includes the time and timezone information. 
}

function getWeekEnd(date: string) {
  const weekStart = getWeekStart(date);
  const startDate = new Date(`${weekStart}T00:00:00`);

  startDate.setDate(startDate.getDate() + 6);

  return startDate.toISOString().slice(0, 10);
}

function getMonthStart(date: string) {
  return `${date.slice(0, 7)}-01`;
}

function getMonthEnd(date: string) {
  const currentDate = new Date(`${date.slice(0, 7)}-01T00:00:00`);

  currentDate.setMonth(currentDate.getMonth() + 1);
  currentDate.setDate(0);

  return currentDate.toISOString().slice(0, 10);
}

export async function runScreener(
  period: ScreenerPeriod,
  type: ScreenerType,
  date: string,
  limit: number
) {
  if (period === "daily") {
    return await runDailyScreener(type, date, limit);
  }

  return await runPeriodScreener(
    period,
    type,
    date,
    limit
  );
}

async function runDailyScreener(
  type: ScreenerType,
  date: string,
  limit: number
) {
  const currentPrices = await getPricesForDate(date);

  if (currentPrices.length === 0) {
    throw new Error(
      "No market data available for the selected date"
    );
  }

  const previousDateRows =
    await getPreviousTradingDate(date);

  const previousDate =
    previousDateRows[0]?.trading_date;

  if (!previousDate) {
    throw new Error(
      "No previous trading day available"
    );
  }

  const previousPrices =
    await getPricesForDate(previousDate);

  const previousPriceMap = new Map(
    previousPrices.map((row: any) => [
      row.symbol,
      Number(row.close_price),
    ])
  ); //Previous prices is an array of objects with symbol and close_price properties like { symbol: "RELIANCE", close_price: "1400" }. 
  //We create a map on this array which leads to ['RELIANCE', 1400] and so on. 
  //Then the outer map is to map "RELIANCE":1400

  const results = currentPrices
    .map((row: any) => {
      const previousPrice =
        previousPriceMap.get(row.symbol); //get previous price

      if (!previousPrice) {
        return null;
      }

      const currentPrice = Number(row.close_price); 

      return {
        symbol: row.symbol,
        company_name: row.company_name,
        start_price: previousPrice,
        end_price: currentPrice,
        percentage_change: calculatePercentageChange(
          previousPrice,
          currentPrice
        ),
        trading_date: date,
      };
    })
    .filter((result) => result !== null); //remove null values from the results array. This is necessary because some stocks may not have a previous price, and we don't want to include those in the final results.

  results.sort((a, b) => {  //sort the results array based on percentage change. If type is gainers, sort in descending order largest to smallest, else if losers sort in ascending order, -5% to +5% for example.
    if (type === "gainers") {
      return (
        b.percentage_change -
        a.percentage_change
      );
    }

    return (
      a.percentage_change -
      b.percentage_change
    );
  });

  return results.slice(0, limit); //return the top limit results. If limit is 5, return the top 5 results. If limit is 10, return the top 10 results and so on.
}

async function runPeriodScreener(
  period: ScreenerPeriod,
  type: ScreenerType,
  date: string,
  limit: number
) {
  // Make sure the selected date itself
  // is a trading date with market data.
  const selectedDatePrices =
    await getPricesForDate(date);

  if (selectedDatePrices.length === 0) {
    throw new Error(
      "No market data available for the selected date"
    );
  }
  let from: string;
  let to: string;

  if (period === "weekly") {
    from = getWeekStart(date);
    to = getWeekEnd(date);
  } else {
    from = getMonthStart(date);
    to = getMonthEnd(date);
  }

  const rows = await getPricesBetweenDates(
    from,
    to
  );

  if (rows.length === 0) {
    throw new Error(
      "No market data available for the selected period"
    );
  }

  const stockPrices = new Map<
    string,
    {
      symbol: string;
      company_name: string;
      start_price: number;
      end_price: number;
      start_date: string;
      end_date: string;
    }
  >();

  for (const row of rows as any[]) {
    const existing = stockPrices.get(row.symbol); //check if the stock symbol already exists in the map. If it does, update the end price and end date. If it doesn't, create a new entry in the map with the start price and start date.

    const price = Number(row.close_price);

    if (!existing) { 
      stockPrices.set(row.symbol, {
        symbol: row.symbol,
        company_name: row.company_name,
        start_price: price,
        end_price: price,
        start_date: row.trading_date,
        end_date: row.trading_date,
      });

      continue;
    }

    existing.end_price = price;
    existing.end_date = row.trading_date; //update the end price and end date for the existing stock symbol in the map.
  }

  const results = Array.from(
    stockPrices.values()
  ).map((stock) => ({
    symbol: stock.symbol,
    company_name: stock.company_name,
    start_price: stock.start_price,
    end_price: stock.end_price,
    percentage_change: calculatePercentageChange(
      stock.start_price,
      stock.end_price
    ),
    start_date: stock.start_date,
    end_date: stock.end_date,
  }));

  results.sort((a, b) => {
    if (type === "gainers") {
      return (
        b.percentage_change -
        a.percentage_change
      );
    }

    return (
      a.percentage_change -
      b.percentage_change
    );
  });

  return results.slice(0, limit);

  /*`stockPrices` is a `Map` where each stock symbol is associated with an object containing that stock’s starting price, ending price, and dates for the selected period.
   `stockPrices.values()` gets only those stock objects, without their symbols as Map keys. 
   Since `.values()` returns an iterator rather than a normal array, `Array.from()` converts those values into an array.
    We then use `.map()` to go through each stock object and create a new result object. 
    For each stock, we copy its symbol, company name, starting price, ending price, start date, and end date, while also calculating its `percentage_change` using the starting and ending prices. 
    The final `results` variable is therefore an array of complete screener results, with one object per stock.*/

}
export async function getScreenerDateRange() {
  return await getHistoricalDateRange();
}