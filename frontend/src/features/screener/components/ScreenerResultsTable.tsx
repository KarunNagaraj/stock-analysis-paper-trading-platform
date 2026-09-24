import { Link } from "react-router-dom";
import type {
    ScreenerPeriod,
    ScreenerResult,
} from "../../../types/screener.types";

type ScreenerResultsTableProps = {
    period: ScreenerPeriod;
    results: ScreenerResult[];
};

export default function ScreenerResultsTable({
    period,
    results,
}: ScreenerResultsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            #
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Symbol
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Company
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Start
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                            End
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Change
                        </th>

                        {period === "daily" ? (
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Date
                            </th>
                        ) : (
                            <>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Start Date
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    End Date
                                </th>
                            </>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {results.map((stock, index) => {
                        const positive = stock.percentage_change >= 0;

                        return (
                            <tr
                                key={stock.symbol}
                                className="transition hover:bg-slate-50"
                            >
                                <td className="px-5 py-4 font-medium text-slate-400">
                                    {index + 1}
                                </td>

                                <td className="px-5 py-4">
                                    <Link
                                        to={`/stocks/${stock.symbol}`}
                                        className="font-bold text-slate-900 transition hover:text-blue-600"
                                    >
                                        {stock.symbol}
                                    </Link>
                                </td>

                                <td className="px-5 py-4 text-slate-600">
                                    {stock.company_name}
                                </td>

                                <td className="px-5 py-4 text-right font-medium text-slate-700">
                                    {stock.start_price}
                                </td>

                                <td className="px-5 py-4 text-right font-medium text-slate-700">
                                    {stock.end_price}
                                </td>

                                <td className="px-5 py-4 text-right">
                                    <span
                                        className={
                                            positive
                                                ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                                                : "inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700"
                                        }
                                    >
                                        {positive ? "+" : ""}
                                        {stock.percentage_change.toFixed(2)}%
                                    </span>
                                </td>

                                {period === "daily" ? (
                                    <td className="px-5 py-4 text-slate-500">
                                        {stock.trading_date}
                                    </td>
                                ) : (
                                    <>
                                        <td className="px-5 py-4 text-slate-500">
                                            {stock.start_date}
                                        </td>

                                        <td className="px-5 py-4 text-slate-500">
                                            {stock.end_date}
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}