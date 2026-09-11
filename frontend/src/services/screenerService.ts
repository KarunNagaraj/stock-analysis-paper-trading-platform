import api from "../services/api";

export async function getScreenerResults(
  period: "daily" | "weekly" | "monthly",
  type: "gainers" | "losers",
  date: string,
  limit: 5 | 10 | 20
) {
  const response = await api.get("/screener", {
    params: {
      period,
      type,
      date,
      limit,
    },
  });

  return response.data;
}

export async function getScreenerDateRange() {
  const response = await api.get(
    "/screener/date-range"
  );

  return response.data[0];
}