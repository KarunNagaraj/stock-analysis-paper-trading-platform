import { useParams } from "react-router-dom";

function StockChart() {
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold">
          {symbol} Chart
        </h1>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          Chart workspace
        </div>
      </div>
    </div>
  );
}

export default StockChart;