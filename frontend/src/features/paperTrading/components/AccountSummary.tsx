import type { PaperAccount } from "../../../types/paperTrading";
import { formatCurrency } from "../utils/paperTradingFormatters";

export default function AccountSummary({ account }: { account: PaperAccount }) {
    const summaryCards = [
        ["Available Cash", account.cash_balance],
        ["Initial Balance", account.initial_balance],
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {summaryCards.map(([label, value]) => (
                <div
                    key={label}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {formatCurrency(value)}
                    </p>
                </div>
            ))}
        </div>
    );
}