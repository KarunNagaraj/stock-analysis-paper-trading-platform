import pool from "../../database/db.js";

export async function getPricesForDate(date: string) {
  const [rows] = await pool.execute(
    `
    SELECT
      s.symbol,
      s.company_name,
      DATE_FORMAT(hp.trading_date, '%Y-%m-%d') AS trading_date,
      hp.close_price
    FROM historical_prices hp
    JOIN stocks s
      ON hp.stock_id = s.id
    WHERE hp.trading_date = ?
    `,
    [date]
  );

  return rows;
}

export async function getPreviousTradingDate(date: string) {
  const [rows] = await pool.execute(
    `
    SELECT
      DATE_FORMAT(MAX(trading_date), '%Y-%m-%d') AS trading_date
    FROM historical_prices
    WHERE trading_date < ?
    `,
    [date]
  );

  return rows;
}

export async function getPricesBetweenDates(
  from: string,
  to: string
) {
  const [rows] = await pool.execute(
    `
    SELECT
      s.symbol,
      s.company_name,
      DATE_FORMAT(hp.trading_date, '%Y-%m-%d') AS trading_date,
      hp.close_price
    FROM historical_prices hp
    JOIN stocks s
      ON hp.stock_id = s.id
    WHERE hp.trading_date BETWEEN ? AND ?
    ORDER BY s.symbol, hp.trading_date ASC
    `,
    [from, to]
  );

  return rows;
}

export async function getHistoricalDateRange() {
  const [rows] = await pool.execute(
    `
    SELECT
      DATE_FORMAT(MIN(trading_date), '%Y-%m-%d') AS min_date,
      DATE_FORMAT(MAX(trading_date), '%Y-%m-%d') AS max_date
    FROM historical_prices
    `
  );

  return rows;
}