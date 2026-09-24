import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getStockBySymbol,
} from "../../services/stockService";
import type { PaperOrderSide } from "../../services/paperTradingService";
import PaperOrderModal from "../paperTrading/components/PaperOrderModal";
import HistoricalPriceChart from "./HistoricalPriceChart";

/* purpose of this file:
To render the exact stocks details from the list of stocks chosen by the user in StockSearch.tsx
It uses getParams to extract the specific stock and then uses getStockBySymbol
// 1. Create the URL
<Link to={`/stocks/${stock.symbol}`} />

// 2. Define what URLs should show the component
<Route path="/stocks/:symbol" element={<StockDetails />} />

// 3. Read the dynamic part of the URL
const { symbol } = useParams();
*/

type StockDetailsData = {
  id: number;
  symbol: string;
  company_name: string;
  exchange: string;
  sector: string | null;
  industry: string | null;

  quote: {
    price: number;
    dayHigh: number | null;
    dayLow: number | null;
    previousClose: number | null;
    volume: number | null;
  };

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

  const [stock, setStock] =
    useState<StockDetailsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderSide, setOrderSide] = useState<PaperOrderSide | null>(null);
  const [orderMessage, setOrderMessage] = useState("");
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

  const priceChange =
    stock.quote.previousClose !== null
      ? stock.quote.price - stock.quote.previousClose
      : null;

  const priceChangePercent =
    stock.quote.previousClose !== null
      ? (priceChange! / stock.quote.previousClose) * 100
      : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_24%),linear-gradient(180deg,#edf5ff_0%,#f8fafc_100%)] p-8">

      {/* Stock Header */}
      <div className="rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">
              {stock.exchange}
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              {stock.symbol}
            </h1>

            <p className="mt-1 text-lg text-gray-600">
              {stock.company_name}
            </p>

            <div className="mt-3 flex gap-2 text-sm text-slate-500">
              <span>{stock.sector}</span>
              <span>•</span>
              <span>{stock.industry}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOrderSide("BUY")}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-md shadow-blue-600/25 transition hover:brightness-110"
            >
              Buy
            </button>

            <button
              type="button"
              onClick={() => setOrderSide("SELL")}
              className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-semibold text-white shadow-md shadow-red-500/20 transition hover:brightness-110"
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {orderMessage && (
        <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {orderMessage}
        </div>
      )}


      {/* Basic Price Information */}
      <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <h2 className="text-xl font-semibold">
          Price
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">
              Current Price
            </p>

            <div className="flex items-baseline gap-3">
              <p className="mt-1 text-2xl font-semibold">
                ₹{stock.quote.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              {priceChange !== null && priceChangePercent !== null && (
                <p className="text-sm font-medium">
                  {priceChange >= 0 ? "+" : ""}
                  ₹{priceChange.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  {" ("}
                  {priceChangePercent >= 0 ? "+" : ""}
                  {priceChangePercent.toFixed(2)}%
                  {")"}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Day High
            </p>

            <p className="mt-1 font-medium">
              {stock.quote.dayHigh !== null
                ? `₹${stock.quote.dayHigh.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Day Low
            </p>

            <p className="mt-1 font-medium">
              {stock.quote.dayLow !== null
                ? `₹${stock.quote.dayLow.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Previous Close
            </p>

            <p className="mt-1 font-medium">
              {stock.quote.previousClose !== null
                ? `₹${stock.quote.previousClose.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
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

      {/* Historical Prices */}
      <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <h2 className="text-xl font-semibold">
          Historical Prices
        </h2>

        <HistoricalPriceChart symbol={stock.symbol} />

        <Link
          to={`/stocks/${stock.symbol}/chart`}
          className="mt-4 inline-block rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/25 transition hover:brightness-110"
        >
          Open Full Chart
        </Link>
      </div>

      {orderSide && (
        <PaperOrderModal
          symbol={stock.symbol}
          side={orderSide}
          currentPrice={stock.quote.price}
          onClose={() => setOrderSide(null)}
          onSuccess={() => {
            setOrderSide(null);
            setOrderMessage(
              `${orderSide === "BUY" ? "Buy" : "Sell"} order executed successfully`
            );
          }}
        />
      )}

    </div>
  );
}

export default StockDetails;