import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getScreenerResults,getScreenerDateRange } from "../../services/screenerService";
import type {
  ScreenerPeriod,
  ScreenerType,
  ScreenerLimit,
  ScreenerResult,
} from "../../types/screener.types";

function Screener() {
  const [period, setPeriod] =
    useState<ScreenerPeriod>("daily");

  const [type, setType] =
    useState<ScreenerType>("gainers");

  const [date, setDate] =
    useState("");

  const [limit, setLimit] =
    useState<ScreenerLimit>(5);

  const [results, setResults] =
    useState<ScreenerResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [minDate, setMinDate] =
  useState("");

const [maxDate, setMaxDate] =
  useState("");

const [dateLoading, setDateLoading] =
  useState(true);

  useEffect(() => {
  async function loadDateRange() {
    try {
      const data =
        await getScreenerDateRange();

      setMinDate(data.min_date);
      setMaxDate(data.max_date);

      setDate(data.max_date);
    } catch {
      setError(
        "Failed to load historical date range"
      );
    } finally {
      setDateLoading(false);
    }
  }

  loadDateRange();
}, []);


  async function handleRunScreener() {
    if (!date) {
      setError("Please select a date");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getScreenerResults(
        period,
        type,
        date,
        limit
      );

      setResults(data);
    } catch (error: any) {
      setResults([]);

      setError(
        error.response?.data?.error ||
          "Failed to run screener"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Stock Screener
      </h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block">
            Period
          </label>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(
                event.target.value as ScreenerPeriod
              )
            }
            className="rounded border p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block">
            Type
          </label>

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as ScreenerType
              )
            }
            className="rounded border p-2"
          >
            <option value="gainers">Gainers</option>
            <option value="losers">Losers</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block">
            Date
          </label>

          <input
              type="date"
              value={date}
              min={minDate}
              max={maxDate}
              disabled={dateLoading}
              onChange={(event) =>
                setDate(event.target.value)
              }
              className="rounded border p-2"
            />
        </div>

        <div>
          <label className="mb-1 block">
            Results
          </label>

          <select
            value={limit}
            onChange={(event) =>
              setLimit(
                Number(event.target.value) as ScreenerLimit
              )
            }
            className="rounded border p-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleRunScreener}
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Loading..." : "Run Screener"}
      </button>

      {error && (
        <p className="mt-4 text-red-600">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        results.length === 0 &&
        date && (
          <p className="mt-4">
            No results found.
          </p>
        )}

      {results.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  #
                </th>
                <th className="p-3 text-left">
                  Symbol
                </th>
                <th className="p-3 text-left">
                  Company
                </th>
                <th className="p-3 text-right">
                  Start Price
                </th>
                <th className="p-3 text-right">
                  End Price
                </th>
                <th className="p-3 text-right">
                  Change
                </th>
                <th className="p-3 text-left">
                  Start Date
                </th>
                <th className="p-3 text-left">
                  End Date
                </th>
              </tr>
            </thead>

            <tbody>
              {results.map((stock, index) => (
                <tr
                  key={stock.symbol}
                  className="border-b"
                >
                  <td className="p-3">
                    {index + 1}
                  </td>

                  <td className="p-3 font-medium">
                    <Link to={`/stocks/${stock.symbol}`}>
                      {stock.symbol}
                    </Link>
                  </td>

                  <td className="p-3">
                    {stock.company_name}
                  </td>

                  <td className="p-3 text-right">
                    {stock.start_price}
                  </td>

                  <td className="p-3 text-right">
                    {stock.end_price}
                  </td>

                  <td className="p-3 text-right">
                    {stock.percentage_change.toFixed(2)}%
                  </td>

                  <td className="p-3">
                    {stock.start_date}
                  </td>

                  <td className="p-3">
                    {stock.end_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Screener;