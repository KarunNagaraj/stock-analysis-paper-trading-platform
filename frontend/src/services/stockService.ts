import api from "./api";
//used for pattern matching any user input for a stock rather than the exact name.part of StockSearch.tsx
export async function searchStocks(searchTerm: string) {
  const response = await api.get("/stocks/search", {
    params: {
      q: searchTerm,
    },
  });

  return response.data;
}
//used for getting the exact stock and its details. Part of StockDetails.tsx
export async function getStockBySymbol(symbol: string) {
  const response = await api.get(`/stocks/${symbol}`);

  return response.data;
}