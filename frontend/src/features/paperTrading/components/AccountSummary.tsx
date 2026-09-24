import type { PaperAccount } from "../../../types/paperTrading";
import { formatCurrency } from "../utils/paperTradingFormatters";

export default function AccountSummary({
    account,
}: {
    account: PaperAccount;
}) {
    const summaryCards = [
        {
            label: "Available Cash",
            value: account.cash_balance,
        },
        {
            label: "Initial Balance",
            value: account.initial_balance,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {summaryCards.map(({ label, value }) => (
                <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {formatCurrency(value)}
                    </p>
                </div>
            ))}
        </div>
    );
}