import { useEffect, useState } from "react";
import {
    createPaperAccount,
    getPaperAccount,
    resetPaperAccount,
} from "../../services/paperTradingService";
import type { PaperAccount } from "../../types/paperTrading";

export default function PaperTradingAccount() {
    const [account, setAccount] = useState<PaperAccount | null>(null);
    const [initialBalance, setInitialBalance] = useState("100000");
    const [resetBalance, setResetBalance] = useState("100000");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAccount() {
            try {
                const data = await getPaperAccount();
                setAccount(data);
            } catch (error: any) {
                if (error.response?.status !== 404) {
                    setError("Failed to load paper trading account");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadAccount();
    }, []);

    async function handleCreateAccount() {
        setError("");

        const balance = Number(initialBalance);

        if (!Number.isFinite(balance) || balance <= 0) {
            setError("Enter a valid initial balance");
            return;
        }

        try {
            setIsCreating(true);

            const data = await createPaperAccount({
                initialBalance: balance,
            });

            setAccount(data);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to create paper trading account"
            );
        } finally {
            setIsCreating(false);
        }
    }

    async function handleResetAccount() {
        setError("");

        const balance = Number(resetBalance);

        if (!Number.isFinite(balance) || balance <= 0) {
            setError("Enter a valid reset balance");
            return;
        }

        const confirmed = window.confirm(
            `Reset your account with ₹${balance.toLocaleString("en-IN")}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsResetting(true);

            const data = await resetPaperAccount({
                initialBalance: balance,
            });

            setAccount(data);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to reset paper trading account"
            );
        } finally {
            setIsResetting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <p className="text-gray-500">
                    Loading paper trading account...
                </p>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="mx-auto max-w-lg">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Create Paper Trading Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Set the amount of virtual cash you want to start with.
                    </p>

                    <div className="mt-6">
                        <label
                            htmlFor="initialBalance"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Initial Balance
                        </label>

                        <input
                            id="initialBalance"
                            type="number"
                            min="1"
                            step="0.01"
                            value={initialBalance}
                            onChange={(e) =>
                                setInitialBalance(e.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {error && (
                        <p className="mt-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleCreateAccount}
                        disabled={isCreating}
                        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isCreating
                            ? "Creating..."
                            : "Create Paper Account"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Paper Trading
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Practice trading with virtual money.
                </p>
            </div>

            {error && (
                <p className="mb-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Available Cash
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ₹{Number(account.cash_balance).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Initial Balance
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ₹{Number(account.initial_balance).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                    Account
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Account ID: {account.id}
                </p>

                <div className="mt-5">
                    <label
                        htmlFor="resetBalance"
                        className="block text-sm font-medium text-gray-700"
                    >
                        New Initial Balance
                    </label>

                    <input
                        id="resetBalance"
                        type="number"
                        min="1"
                        step="0.01"
                        value={resetBalance}
                        onChange={(e) => setResetBalance(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                        onClick={handleResetAccount}
                        disabled={isResetting}
                        className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isResetting ? "Resetting..." : "Reset Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}
