import { useState } from "react";
import {
  searchStocks
} from "../../services/stockService";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setStocks([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const results = await searchStocks(searchTerm.trim());

      setStocks(results);
    } catch (error) {
      console.error("Stock search failed:", error);
      setError("Failed to search stocks.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          Stock Screener
        </h1>
        <input
          type="text"
          placeholder="Search by symbol or company name"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && stocks.length === 0 && searchTerm && (
        <p className="mt-4 text-gray-500">
          No stocks found.
        </p>
      )}

      <div className="mt-4 space-y-2">
        {stocks.map((stock) => (
          <div
                key={stock.id}
                onClick={() => navigate(`/stocks/${stock.symbol}`)}
                className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {stock.symbol}
                </h2>

                <p className="text-gray-700">
                  {stock.company_name}
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {stock.exchange}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {stock.sector} · {stock.industry}
            </p>
          </div>
        ))}
      </div>

     
    </div>
  );
}

export default StockSearch;