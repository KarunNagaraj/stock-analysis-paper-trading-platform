import { useEffect, useRef, useState } from "react";
import {
  searchStocks,
  getStockBySymbol,
} from "../../services/stockService";
import PaperOrderModal from "../paperTrading/components/PaperOrderModal";
import { Link } from "react-router-dom";

type Stock = {
  id: number;
  symbol: string;
  company_name: string;
  exchange: string;
  sector: string | null;
  industry: string | null;
};

function StockSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [orderStock, setOrderStock] = useState<Stock | null>(null);
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL" | null>(null);
  const [orderPrice, setOrderPrice] = useState<number | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const searchRequestId = useRef(0);

  useEffect(() => {
    const query = searchTerm.trim();

    if (!query) {
      setStocks([]);
      setError("");
      setLoading(false);
      return;
    }

    const requestId = ++searchRequestId.current;

    const timeoutId = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const results = await searchStocks(query);

        if (requestId === searchRequestId.current) {
          setStocks(results);
        }
      } catch (error) {
        console.error("Stock search failed:", error);

        if (requestId === searchRequestId.current) {
          setError("Failed to search stocks.");
          setStocks([]);
        }
      } finally {
        if (requestId === searchRequestId.current) {
          setLoading(false);
        }
      }
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleOpenOrder = async (
    stock: Stock,
    side: "BUY" | "SELL"
  ) => {
    try {
      setOrderLoading(true);
      setError("");

      const stockDetails = await getStockBySymbol(stock.symbol);

      setOrderStock(stock);
      setOrderSide(side);
      setOrderPrice(stockDetails.quote.price);
    } catch (error) {
      console.error("Failed to load stock price:", error);
      setError("Unable to load the current stock price.");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_26%),linear-gradient(180deg,#edf5ff_0%,#f8fafc_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
            Market Research
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find a Stock
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Search NSE-listed companies by symbol or company name.
          </p>
        </div>

        <section className="rounded-2xl border border-sky-100 bg-white/85 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-5">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              type="text"
              placeholder="Search by symbol or company name..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-sky-200 bg-sky-50/60 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              </div>
            )}

            {!loading && searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>
              {searchTerm
                ? `${stocks.length} result${stocks.length === 1 ? "" : "s"}`
                : "Start typing to search"}
            </span>

            {searchTerm && <span>Searching automatically</span>}
          </div>
        </section>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && searchTerm && stocks.length === 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/85 px-6 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No stocks found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try a different symbol or company name.
            </p>
          </div>
        )}

        {!searchTerm && (
          <div className="mt-6 rounded-2xl border border-dashed border-sky-200 bg-white/70 px-6 py-12 text-center shadow-[0_12px_30px_rgba(14,116,144,0.04)]">
            <h2 className="text-base font-semibold text-slate-900">
              Search the market
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Enter a few characters and matching NSE stocks will appear
              automatically.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {stocks.map((stock) => (
            <div
              key={stock.id}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_12px_25px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_20px_35px_rgba(37,99,235,0.08)] sm:flex-row sm:items-center sm:justify-between"
            >
              <Link
                to={`/stocks/${stock.symbol}`}
                className="min-w-0 flex-1"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold tracking-tight text-slate-900">
                    {stock.symbol}
                  </span>

                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                    {stock.exchange}
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {stock.company_name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {stock.sector ?? "Sector unavailable"}
                  {stock.industry ? ` · ${stock.industry}` : ""}
                </p>
              </Link>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={orderLoading}
                  onClick={() => handleOpenOrder(stock, "BUY")}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:brightness-110 disabled:opacity-50"
                >
                  Buy
                </button>

                <button
                  type="button"
                  disabled={orderLoading}
                  onClick={() => handleOpenOrder(stock, "SELL")}
                  className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:brightness-110 disabled:opacity-50"
                >
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>

        {orderStock && orderSide && orderPrice !== null && (
          <PaperOrderModal
            symbol={orderStock.symbol}
            currentPrice={orderPrice}
            side={orderSide}
            onClose={() => {
              setOrderStock(null);
              setOrderSide(null);
              setOrderPrice(null);
            }}
            onSuccess={() => {
              setOrderStock(null);
              setOrderSide(null);
              setOrderPrice(null);
            }}
          />
        )}
      </div>
    </main>
  );
}

export default StockSearch;