import type { PaperPortfolio } from "../../../types/paperPortfolio.types";
import { formatCurrency, formatPnl } from "../utils/paperTradingFormatters";

export default function PortfolioSummary({ portfolio }: { portfolio: PaperPortfolio }) {
    const valueCards = [
        ["Portfolio Value", formatCurrency(portfolio.portfolioValue)],
        ["Cash Balance", formatCurrency(portfolio.cashBalance)],
        ["Invested Value", formatCurrency(portfolio.investedValue)],
        ["Return", `${portfolio.returnPercentage.toFixed(6)}%`],
    ];
    const pnlCards = [
        ["Realized P&L", formatPnl(portfolio.realizedPnl)],
        ["Unrealized P&L", formatPnl(portfolio.unrealizedPnl)],
        ["Total P&L", formatPnl(portfolio.totalPnl)],
    ];

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {valueCards.map(([label, value]) => (
                    <div
                        key={label}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {pnlCards.map(([label, value]) => (
                    <div
                        key={label}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="mt-2 text-xl font-semibold text-gray-900">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}