import pool from "../../database/db.js";

export async function getAllStocks() {
  const [rows] = await pool.query(
    `SELECT
       id,
       symbol,
       company_name,
       exchange,
       sector,
       industry
     FROM stocks`
  );

  return rows;
}

export async function searchStocks(searchTerm: string) {
  const [rows] = await pool.execute(
    `SELECT
       id,
       symbol,
       company_name,
       exchange,
       sector,
       industry
     FROM stocks
     WHERE symbol LIKE ? OR company_name LIKE ?`,
    [`%${searchTerm}%`, `%${searchTerm}%`]
  );

  return rows;
}

export async function getStockBySymbol(symbol: string) {
  const [rows] = await pool.execute(
    `SELECT
       s.id,
       s.symbol,
       s.company_name,
       s.exchange,
       s.sector,
       s.industry,

       f.market_cap,
       f.pe_ratio,
       f.pb_ratio,
       f.eps,
       f.roe,
       f.roce,
       f.profit_margin,
       f.revenue_growth,
       f.profit_growth,
       f.debt_to_equity,
       f.dividend_yield,
       f.updated_at AS fundamentals_updated_at

     FROM stocks s

     LEFT JOIN fundamentals f
       ON s.id = f.stock_id

     WHERE s.symbol = ?`,
    [symbol]
  );

  return rows;
}