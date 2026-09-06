import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStockBySymbol } from "../../services/stockService";
/* purpose of this file:
To render the exact stocks details from the list of stocks chosen by the user in StockSearch.tsx
It uses getParams to extract the specific stock and then uses getStockBySymbol
// 1. Create the URL
<Link to={`/stocks/${stock.symbol}`} />

// 2. Define what URLs should show the component
<Route path="/stocks/:symbol" element={<StockDetails />} />

// 3. Read the dynamic part of the URL
const { symbol } = useParams();*/


type StockDetailsData = {
  id: number;
  symbol: string;
  company_name: string;
  exchange: string;
  sector: string | null;
  industry: string | null;

  market_cap: string | null;
  pe_ratio: string | null;
  pb_ratio: string | null;
  eps: string | null;
  roe: string | null;
  roce: string | null;
  profit_margin: string | null;
  revenue_growth: string | null;
  profit_growth: string | null;
  debt_to_equity: string | null;
  dividend_yield: string | null;

  fundamentals_updated_at: string | null;
};
function hasFundamentals(stock: StockDetailsData) {
  return [
    stock.pe_ratio,
    stock.pb_ratio,
    stock.eps,
    stock.roe,
    stock.roce,
    stock.profit_margin,
    stock.revenue_growth,
    stock.profit_growth,
    stock.debt_to_equity,
    stock.dividend_yield,
  ].some((value) => value !== null);
}
function formatMetric(
  value: string | null,
  suffix = ""
) {
  if (value === null) {
    return "N/A";
  }

  return `${value}${suffix}`;
}
type MetricProps = {
  label: string;
  value: string | null;
  suffix?: string;
};

function Metric({
  label,
  value,
  suffix = "",
}: MetricProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {formatMetric(value, suffix)}
      </p>
    </div>
  );
}

type InfoItemProps = {
  label: string;
  value: string | null;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value ?? "N/A"}
      </p>
    </div>
  );
}

function StockDetails() {
  const { symbol } = useParams();

  const [stock, setStock] = useState<StockDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStockDetails() {
      try {
        if (!symbol) {
          setError("Stock symbol is missing");
          return;
        }

        const data = await getStockBySymbol(symbol);

        setStock(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load stock details");
      } finally {
        setLoading(false);
      }
    }

    loadStockDetails();
  }, [symbol]);

  if (loading) {
    return <p>Loading stock details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!stock) {
    return <p>Stock not found</p>;
  }

 return (
  <div className="min-h-screen bg-gray-50 p-8">

    {/* Stock Header */}
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {stock.exchange}
      </p>

      <h1 className="mt-1 text-3xl font-bold">
        {stock.symbol}
      </h1>

      <p className="mt-1 text-lg text-gray-600">
        {stock.company_name}
      </p>

      <div className="mt-3 flex gap-2 text-sm text-gray-500">
        <span>{stock.sector}</span>
        <span>•</span>
        <span>{stock.industry}</span>
      </div>
    </div>


    {/* Basic Price Information */}
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Price
      </h2>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Current Price
        </p>

        <p className="mt-1 text-2xl font-bold">
          —
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Market data will be available in Feature 4.
        </p>
      </div>
    </div>


    {/* Company Information */}
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Company Information
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">

        <InfoItem
          label="Symbol"
          value={stock.symbol}
        />

        <InfoItem
          label="Exchange"
          value={stock.exchange}
        />

        <InfoItem
          label="Sector"
          value={stock.sector}
        />

        <InfoItem
          label="Industry"
          value={stock.industry}
        />

      </div>
    </div>


    {/* Fundamentals */}
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Fundamentals
      </h2>

      {hasFundamentals(stock) ? (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">

          <Metric
            label="P/E Ratio"
            value={stock.pe_ratio}
          />

          <Metric
            label="P/B Ratio"
            value={stock.pb_ratio}
          />

          <Metric
            label="EPS"
            value={stock.eps}
          />

          <Metric
            label="ROE"
            value={stock.roe}
            suffix="%"
          />

          <Metric
            label="ROCE"
            value={stock.roce}
            suffix="%"
          />

          <Metric
            label="Profit Margin"
            value={stock.profit_margin}
            suffix="%"
          />

          <Metric
            label="Revenue Growth"
            value={stock.revenue_growth}
            suffix="%"
          />

          <Metric
            label="Profit Growth"
            value={stock.profit_growth}
            suffix="%"
          />

          <Metric
            label="Debt / Equity"
            value={stock.debt_to_equity}
          />

          <Metric
            label="Dividend Yield"
            value={stock.dividend_yield}
            suffix="%"
          />

        </div>
      ) : (
        <p className="mt-4 text-gray-500">
          Fundamental data unavailable.
        </p>
      )}
    </div>

  </div>
);
}

export default StockDetails;