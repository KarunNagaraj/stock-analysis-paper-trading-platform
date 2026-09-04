import api from "./api";

export async function searchStocks(searchTerm: string) {
  const response = await api.get("/stocks/search", {
    params: {
      q: searchTerm,
    },
  });

  return response.data;
}

export async function getStockBySymbol(symbol: string) {
  const response = await api.get(`/stocks/${symbol}`);

  return response.data;
}