import { useState } from "react";
import type { PaperAccount } from "../../../types/paperTrading";

type ResetAccountFormProps = {
    account: PaperAccount;
    isResetting: boolean;
    onReset: (balance: number) => void;
};

export default function ResetAccountForm({
    account,
    isResetting,
    onReset,
}: ResetAccountFormProps) {
    const [resetBalance, setResetBalance] = useState("100000");

    function handleReset() {
        const balance = Number(resetBalance);

        if (!Number.isFinite(balance) || balance <= 0) {
            onReset(balance);
            return;
        }

        if (
            window.confirm(
                `Reset your account with ₹${balance.toLocaleString("en-IN")}?`
            )
        ) {
            onReset(balance);
        }
    }

    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                    Account Settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Reset your paper account and start a new simulation.
                </p>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Account ID
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                    {account.id}
                </p>
            </div>

            <label
                htmlFor="resetBalance"
                className="mt-5 block text-sm font-semibold text-slate-700"
            >
                New Initial Balance
            </label>

            <input
                id="resetBalance"
                type="number"
                min="1"
                step="0.01"
                value={resetBalance}
                onChange={(event) => setResetBalance(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="mt-4 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
                {isResetting ? "Resetting..." : "Reset Account"}
            </button>
        </section>
    );
}