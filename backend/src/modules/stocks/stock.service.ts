
//The repository knows how to talk to the database.The service knows what the application should do with that data like filtering etc.
import {
  getAllStocks,
  searchStocks,
  getStockBySymbol,
} from "./stock.repository.js";

export async function getAllStocksService() {
  return await getAllStocks();
}

export async function searchStocksService(searchTerm: string) {
  return await searchStocks(searchTerm);
}

export async function getStockBySymbolService(symbol: string) {
  const stocks = await getStockBySymbol(symbol);

  if (stocks.length === 0) {
    throw new Error("Stock not found");
  }

  return stocks[0];
}