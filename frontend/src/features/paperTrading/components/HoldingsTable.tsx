import type { PaperPortfolioPosition } from "../../../types/paperPortfolio.types";
import { formatCurrency, formatPnl } from "../utils/paperTradingFormatters";

export default function HoldingsTable({ positions }: { positions: PaperPortfolioPosition[] }) {
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
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Holdings</h2>

            {positions.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">No holdings yet.</p>
            ) : (
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-gray-200 text-gray-500">
                            <tr>
                                {headings.map((heading) => (
                                    <th key={heading} className="px-4 py-3 font-medium">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {positions.map((position) => (
                                <tr key={position.stockId}>
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                                        {position.symbol}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                        {position.quantity}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                        {formatCurrency(position.averagePrice)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                        {formatCurrency(position.currentPrice)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                        {formatCurrency(position.investedValue)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                        {formatCurrency(position.marketValue)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
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