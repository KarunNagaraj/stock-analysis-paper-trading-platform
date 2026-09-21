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
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Symbol</th>
                        <th className="p-3 text-left">Company</th>
                        <th className="p-3 text-right">Start Price</th>
                        <th className="p-3 text-right">End Price</th>
                        <th className="p-3 text-right">Change</th>
                        {period === "daily" ? (
                            <th className="p-3 text-left">Date</th>
                        ) : (
                            <>
                                <th className="p-3 text-left">Start Date</th>
                                <th className="p-3 text-left">End Date</th>
                            </>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {results.map((stock, index) => (
                        <tr key={stock.symbol} className="border-b">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3 font-medium">
                                <Link
                                    to={`/stocks/${stock.symbol}`}
                                    className="underline"
                                >
                                    {stock.symbol}
                                </Link>
                            </td>
                            <td className="p-3">{stock.company_name}</td>
                            <td className="p-3 text-right">{stock.start_price}</td>
                            <td className="p-3 text-right">{stock.end_price}</td>
                            <td className="p-3 text-right">
                                {stock.percentage_change.toFixed(2)}%
                            </td>
                            {period === "daily" ? (
                                <td className="p-3">{stock.trading_date}</td>
                            ) : (
                                <>
                                    <td className="p-3">{stock.start_date}</td>
                                    <td className="p-3">{stock.end_date}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}