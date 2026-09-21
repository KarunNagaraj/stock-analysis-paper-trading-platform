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
            <div className="flex justify-center py-10">
                <p className="text-gray-500">Loading paper trading account...</p>
            </div>
        );
    }

    if (!accountState.account) {
        return (
            <CreateAccountForm
                error={accountState.error}
                isCreating={accountState.isCreating}
                onCreate={accountState.createAccount}
            />
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <AccountHeader error={accountState.error} />
            <AccountSummary account={accountState.account} />

            {portfolioState.isLoading && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Loading portfolio...</p>
                </div>
            )}

            {portfolioState.error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm text-red-600">{portfolioState.error}</p>
                </div>
            )}

            {!portfolioState.isLoading && !portfolioState.error && !portfolioState.portfolio && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Portfolio unavailable.</p>
                </div>
            )}

            {portfolioState.portfolio && (
                <section className="mt-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Paper Portfolio
                    </h2>
                    <PortfolioSummary portfolio={portfolioState.portfolio} />
                    <HoldingsTable positions={portfolioState.portfolio.positions} />
                </section>
            )}

            <AccountSettings
                account={accountState.account}
                isResetting={accountState.isResetting}
                onReset={accountState.resetAccount}
            />
        </div>
    );
}