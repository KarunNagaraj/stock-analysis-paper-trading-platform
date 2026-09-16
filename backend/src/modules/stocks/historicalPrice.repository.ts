import pool from "../../database/db.js";
import { RowDataPacket } from "mysql2";

type StockHistoryStatus = {
  id: number;
  symbol: string;
  provider_symbol: string | null;
  latest_date: string | Date | null;
};

interface LatestPriceRow extends RowDataPacket {
  close_price: number;
}

export async function getLatestPrice(
  stockId: number
): Promise<number | null> {
  const [rows] = await pool.execute<LatestPriceRow[]>(
    `
    SELECT close_price
    FROM historical_prices
    WHERE stock_id = ?
    ORDER BY trading_date DESC
    LIMIT 1
    `,
    [stockId]
  );

  return rows.length > 0 ? rows[0].close_price : null;
}

export async function getStockHistoryStatus(symbol: string) {
  const [rows] = await pool.execute(
    `
    SELECT
      s.id,
      s.symbol,
      s.provider_symbol,
      DATE_FORMAT(
        MAX(hp.trading_date),
        '%Y-%m-%d'
      ) AS latest_date
    FROM stocks s
    LEFT JOIN historical_prices hp
      ON hp.stock_id = s.id
    WHERE s.symbol = ?
    GROUP BY
      s.id,
      s.symbol,
      s.provider_symbol
    `,
    [symbol]
  ) as unknown as [StockHistoryStatus[], unknown];

  return rows[0] ?? null;
}

export async function getAllStocksHistoryStatus() {
  const [rows] = await pool.execute(`
    SELECT
      s.id,
      s.symbol,
      s.provider_symbol,
      MAX(hp.trading_date) AS latest_date
    FROM stocks s
    LEFT JOIN historical_prices hp
      ON hp.stock_id = s.id
    GROUP BY
      s.id,
      s.symbol,
      s.provider_symbol
    ORDER BY s.id
  `) as unknown as [{
    id: number;
    symbol: string;
    provider_symbol: string | null;
    latest_date: string | Date | null;
  }[], unknown];

  return rows;
}

export async function insertHistoricalPrices(
  stockId: number,
  prices: {
    tradingDate: string;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    closePrice: number;
    volume: number | null;
  }[]
) {
  if (prices.length === 0) {
    return;
  }

  const placeholders = prices
    .map(() => "(?, ?, ?, ?, ?, ?, ?)")
    .join(", ");

  const values = prices.flatMap(price => [
    stockId,
    price.tradingDate,
    price.openPrice,
    price.highPrice,
    price.lowPrice,
    price.closePrice,
    price.volume,
  ]);

  await pool.execute(
    `
    INSERT INTO historical_prices
    (
      stock_id,
      trading_date,
      open_price,
      high_price,
      low_price,
      close_price,
      volume
    )
    VALUES ${placeholders}
    ON DUPLICATE KEY UPDATE
      open_price = VALUES(open_price),
      high_price = VALUES(high_price),
      low_price = VALUES(low_price),
      close_price = VALUES(close_price),
      volume = VALUES(volume)
    `,
    values
  );
}

export async function getHistoricalPrices(
  symbol: string,
  from?: string,
  to?: string
) {
  let query = `
    SELECT
      DATE_FORMAT(hp.trading_date, '%Y-%m-%d') AS trading_date,
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