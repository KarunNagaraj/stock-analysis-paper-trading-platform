import AccountHeader from "./components/AccountHeader";
import AccountSettings from "./components/AccountSettings";
import AccountSummary from "./components/AccountSummary";
import CreateAccountForm from "./components/CreateAccountForm";
import HoldingsTable from "./components/HoldingsTable";
import PortfolioSummary from "./components/PortfolioSummary";
import { usePaperAccount } from "./hooks/usePaperAccount";
import { usePaperPortfolio } from "./hooks/usePaperPortfolio";

export default function PaperTradingAccount() {
    const accountState = usePaperAccount();
    const portfolioState = usePaperPortfolio(Boolean(accountState.account));

    if (accountState.isLoading) {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#edf5ff_0%,#f8fafc_100%)]">
                <div className="flex min-h-[50vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                        <p className="mt-3 text-sm text-slate-500">
                            Loading paper trading account...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!accountState.account) {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#edf5ff_0%,#f8fafc_100%)] px-4 py-10">
                <CreateAccountForm
                    error={accountState.error}
                    isCreating={accountState.isCreating}
                    onCreate={accountState.createAccount}
                />
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#edf5ff_0%,#f8fafc_100%)]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <AccountHeader error={accountState.error} />

                <AccountSummary account={accountState.account} />

                {portfolioState.isLoading && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                        <p className="mt-3 text-sm text-slate-500">
                            Loading portfolio...
                        </p>
                    </div>
                )}

                {portfolioState.error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
                        <p className="text-sm text-red-700">
                            {portfolioState.error}
                        </p>
                    </div>
                )}

                {!portfolioState.isLoading &&
                    !portfolioState.error &&
                    !portfolioState.portfolio && (
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Portfolio unavailable.
                            </p>
                        </div>
                    )}

                {portfolioState.portfolio && (
                    <section className="mt-8">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Portfolio Overview
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Performance and current positions.
                            </p>
                        </div>

                        <PortfolioSummary portfolio={portfolioState.portfolio} />

                        <HoldingsTable
                            positions={portfolioState.portfolio.positions}
                        />
                    </section>
                )}

                <AccountSettings
                    account={accountState.account}
                    isResetting={accountState.isResetting}
                    onReset={accountState.resetAccount}
                />
            </div>
        </main>
    );
}