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
       id,
       symbol,
       company_name,
       exchange,
       sector,
       industry
     FROM stocks
     WHERE symbol = ?`,
    [symbol]
  );

  return rows;
}