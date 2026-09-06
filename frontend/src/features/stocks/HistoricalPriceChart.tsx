import { useEffect, useState } from "react";
import { getHistoricalPrices } from "../../services/stockService";

type HistoricalPrice = {
  trading_date: string;
  open_price: string;
  high_price: string;
  low_price: string;
  close_price: string;
  volume: number;
};

type HistoricalPriceChartProps = {
  symbol: string;
};

function HistoricalPriceChart({
  symbol,
}: HistoricalPriceChartProps) {
  const [historicalPrices, setHistoricalPrices] =
    useState<HistoricalPrice[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistoricalPrices() {
      try {
        setLoading(true);
        setError("");

        const data = await getHistoricalPrices(symbol);

        setHistoricalPrices(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load historical prices");
      } finally {
        setLoading(false);
      }
    }

    loadHistoricalPrices();
  }, [symbol]);

  if (loading) {
    return (
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Historical Data
        </h2>

        <p className="mt-4 text-gray-500">
          Loading historical data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Historical Data
        </h2>

        <p className="mt-4 text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Historical Data
      </h2>

      <p className="mt-4 text-gray-600">
        Historical records loaded:{" "}
        {historicalPrices.length}
      </p>
    </div>
  );
}

export default HistoricalPriceChart;