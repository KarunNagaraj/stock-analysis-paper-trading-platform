import { useEffect, useState } from "react";
import {
    createPaperAccount,
    getPaperAccount,
    getPaperPortfolio,
    resetPaperAccount,
} from "../../services/paperTradingService";
import type { PaperAccount } from "../../types/paperTrading";
import type { PaperPortfolio } from "../../types/paperPortfolio.types";

function formatPnl(value: number) {
    return `${value >= 0 ? "+" : ""}₹${value.toFixed(2)}`;
}

export default function PaperTradingAccount() {
    const [account, setAccount] = useState<PaperAccount | null>(null);
    const [initialBalance, setInitialBalance] = useState("100000");
    const [resetBalance, setResetBalance] = useState("100000");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState("");
    const [portfolio, setPortfolio] = useState<PaperPortfolio | null>(null);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [portfolioError, setPortfolioError] = useState<string | null>(null);

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

    useEffect(() => {
        if (!account) {
            setPortfolio(null);
            return;
        }

        async function loadPortfolio() {
            try {
                setPortfolioLoading(true);
                setPortfolioError(null);

                const data = await getPaperPortfolio();
                setPortfolio(data);
            } catch (error) {
                setPortfolioError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load portfolio"
                );
            } finally {
                setPortfolioLoading(false);
            }
        }

        loadPortfolio();
    }, [account]);

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

            {portfolioLoading && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Loading portfolio...</p>
                </div>
            )}

            {portfolioError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm text-red-600">{portfolioError}</p>
                </div>
            )}

            {!portfolioLoading && !portfolioError && !portfolio && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Portfolio unavailable.</p>
                </div>
            )}

            {portfolio && (
                <section className="mt-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Paper Portfolio
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Portfolio Value</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                ₹{portfolio.portfolioValue.toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Cash Balance</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                ₹{portfolio.cashBalance.toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Invested Value</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                ₹{portfolio.investedValue.toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Return</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                {portfolio.returnPercentage.toFixed(6)}%
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Realized P&amp;L</p>
                            <p className="mt-2 text-xl font-semibold text-gray-900">
                                {formatPnl(portfolio.realizedPnl)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Unrealized P&amp;L</p>
                            <p className="mt-2 text-xl font-semibold text-gray-900">
                                {formatPnl(portfolio.unrealizedPnl)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Total P&amp;L</p>
                            <p className="mt-2 text-xl font-semibold text-gray-900">
                                {formatPnl(portfolio.totalPnl)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Holdings
                        </h2>

                        {portfolio.positions.length === 0 ? (
                            <p className="mt-4 text-sm text-gray-500">
                                No holdings yet.
                            </p>
                        ) : (
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="border-b border-gray-200 text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Stock</th>
                                            <th className="px-4 py-3 font-medium">Quantity</th>
                                            <th className="px-4 py-3 font-medium">Avg. Price</th>
                                            <th className="px-4 py-3 font-medium">Current Price</th>
                                            <th className="px-4 py-3 font-medium">Invested</th>
                                            <th className="px-4 py-3 font-medium">Market Value</th>
                                            <th className="px-4 py-3 font-medium">P&amp;L</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {portfolio.positions.map((position) => (
                                            <tr key={position.stockId}>
                                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                                                    {position.symbol}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                                    {position.quantity}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                                    ₹{position.averagePrice.toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                                    ₹{position.currentPrice.toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                                    ₹{position.investedValue.toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                                    ₹{position.marketValue.toFixed(2)}
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
                </section>
            )}

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
