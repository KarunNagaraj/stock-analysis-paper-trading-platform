import pool from "../../database/db.js";

export async function getHistoricalPrices(
  symbol: string,
  from?: string,
  to?: string
) {
  let query = `
    SELECT
      hp.trading_date,
      hp.open_price,
      hp.high_price,
      hp.low_price,
      hp.close_price,
      hp.volume
    FROM historical_prices hp
    JOIN stocks s
      ON hp.stock_id = s.id
    WHERE s.symbol = ?
  `;

  const params: string[] = [symbol];

  if (from) {
    query += ` AND hp.trading_date >= ?`;
    params.push(from);
  }

  if (to) {
    query += ` AND hp.trading_date <= ?`;
    params.push(to);
  }

  query += ` ORDER BY hp.trading_date ASC`;

  const [rows] = await pool.execute(query, params);

  return rows;
}