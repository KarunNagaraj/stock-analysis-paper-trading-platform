
//The repository knows how to talk to the database.The service knows what the application should do with that data like filtering etc.
import {
  getAllStocks,
  searchStocks,
} from "./stock.repository.js";

export async function getAllStocksService() {
  return await getAllStocks();
}

export async function searchStocksService(searchTerm: string) {
  return await searchStocks(searchTerm);
}