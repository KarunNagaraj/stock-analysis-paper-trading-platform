import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHistoricalPrices } from "../../services/stockService";
import StockPriceChart from "./StockPriceChart";

type HistoricalPrice = {
  trading_date: string;
  open_price: string;
  high_price: string;
  low_price: string;
  close_price: string;
  volume: number;
};
type Timeframe = "1M" | "3M" | "6M" | "1Y" | "ALL";
function getFromDate(
  timeframe: Timeframe
): string | undefined {
  if (timeframe === "ALL") {
    return undefined;
  }

  const date = new Date();

  if (timeframe === "1M") {
    date.setMonth(date.getMonth() - 1);
  }

  if (timeframe === "3M") {
    date.setMonth(date.getMonth() - 3);
  }

  if (timeframe === "6M") {
    date.setMonth(date.getMonth() - 6);
  }

  if (timeframe === "1Y") {
    date.setFullYear(date.getFullYear() - 1);
  }

  return date.toISOString().split("T")[0];
}

function StockChart() {
  const { symbol } = useParams<{ symbol: string }>();

  const [historicalPrices, setHistoricalPrices] =
    useState<HistoricalPrice[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [timeframe, setTimeframe] = useState<Timeframe>("1Y");

  useEffect(() => {
    async function loadHistoricalPrices() {
      if (!symbol) {
        setError("Stock symbol is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const from = getFromDate(timeframe);

        const data = await getHistoricalPrices(
          symbol,
          from
        );

        setHistoricalPrices(data);

        setHistoricalPrices(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load historical prices");
      } finally {
        setLoading(false);
      }
    }

    loadHistoricalPrices();
  }, [symbol, timeframe]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p>Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold">
          {symbol} Chart
        </h1>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setTimeframe("1M")}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              1M
            </button>

            <button
              onClick={() => setTimeframe("3M")}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              3M
            </button>

            <button
              onClick={() => setTimeframe("6M")}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              6M
            </button>

            <button
              onClick={() => setTimeframe("1Y")}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              1Y
            </button>

            <button
              onClick={() => setTimeframe("ALL")}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              All
            </button>
          </div>
          <StockPriceChart
            historicalPrices={historicalPrices}
            height={600}
            showVolume
          />
        </div>
      </div>
    </div>
  );
}

export default StockChart;
/*User selects timeframe
        ↓
setTimeframe()
        ↓
React state changes
        ↓
useEffect runs
        ↓
getFromDate()
        ↓
getHistoricalPrices(symbol, from)
        ↓
Backend filters historical_prices
        ↓
historicalPrices state updated
        ↓
StockPriceChart receives new data
        ↓
Chart updates*/