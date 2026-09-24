import type { PaperPortfolioPosition } from "../../../types/paperPortfolio.types";
import {
    formatCurrency,
    formatPnl,
} from "../utils/paperTradingFormatters";

export default function HoldingsTable({
    positions,
}: {
    positions: PaperPortfolioPosition[];
}) {
    const headings = [
        "Stock",
        "Quantity",
        "Avg. Price",
        "Current Price",
        "Invested",
        "Market Value",
        "P&L",
    ];

    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                    Holdings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Current positions in your paper portfolio.
                </p>
            </div>

            {positions.length === 0 ? (
                <div className="px-6 py-10 text-center">
                    <p className="text-sm text-slate-500">No holdings yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                {headings.map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {positions.map((position) => (
                                <tr
                                    key={position.stockId}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">
                                        {position.symbol}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                                        {position.quantity}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                                        {formatCurrency(position.averagePrice)}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                                        {formatCurrency(position.currentPrice)}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                                        {formatCurrency(position.investedValue)}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                                        {formatCurrency(position.marketValue)}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                                        {formatPnl(position.unrealizedPnl)}
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