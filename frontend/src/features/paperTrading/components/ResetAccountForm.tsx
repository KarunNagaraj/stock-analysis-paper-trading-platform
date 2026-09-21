import { useState } from "react";
import type { PaperAccount } from "../../../types/paperTrading";

type ResetAccountFormProps = {
    account: PaperAccount;
    isResetting: boolean;
    onReset: (balance: number) => void;
};

export default function ResetAccountForm({ account, isResetting, onReset }: ResetAccountFormProps) {
    const [resetBalance, setResetBalance] = useState("100000");
    function handleReset() {
        const balance = Number(resetBalance);
        if (!Number.isFinite(balance) || balance <= 0) {
            onReset(balance);
            return;
        }
        if (window.confirm(`Reset your account with ₹${balance.toLocaleString("en-IN")}?`)) {
            onReset(balance);
        }
    }

    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Account</h2>
            <p className="mt-2 text-sm text-gray-500">Account ID: {account.id}</p>

            <label
                htmlFor="resetBalance"
                className="mt-5 block text-sm font-medium text-gray-700"
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
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
                onClick={handleReset}
                disabled={isResetting}
                className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isResetting ? "Resetting..." : "Reset Account"}
            </button>
        </div>
    );
}