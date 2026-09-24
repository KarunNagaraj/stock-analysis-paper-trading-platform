import ScreenerEmptyState from "./components/ScreenerEmptyState";
import ScreenerFilters from "./components/ScreenerFilters";
import ScreenerResultsTable from "./components/ScreenerResultsTable";
import { useScreener } from "./hooks/useScreener";

function Screener() {
    const screener = useScreener();

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_25%),linear-gradient(180deg,#edf5ff_0%,#f8fafc_100%)]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
                        Market Analytics
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Stock Screener
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Compare market performance across selected trading periods.
                    </p>
                </div>

                <section className="rounded-2xl border border-sky-100 bg-white/85 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                    <ScreenerFilters
                        period={screener.period}
                        onPeriodChange={screener.setPeriod}
                        type={screener.type}
                        onTypeChange={screener.setType}
                        date={screener.date}
                        minDate={screener.minDate}
                        maxDate={screener.maxDate}
                        dateLoading={screener.dateLoading}
                        onDateChange={screener.setDate}
                        limit={screener.limit}
                        onLimitChange={screener.setLimit}
                    />
                </section>

                {screener.loading && (
                    <div className="mt-6 rounded-2xl border border-sky-100 bg-white/85 p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                        <p className="mt-3 text-sm text-slate-500">
                            Loading market data...
                        </p>
                    </div>
                )}

                {screener.error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {screener.error}
                    </div>
                )}

                {!screener.loading &&
                    !screener.error &&
                    screener.results.length === 0 &&
                    screener.date && (
                        <div className="mt-6">
                            <ScreenerEmptyState />
                        </div>
                    )}

                {screener.results.length > 0 && (
                    <section className="mt-6 overflow-hidden rounded-2xl border border-sky-100 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Screening Results
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {screener.results.length} stocks matched
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ScreenerResultsTable
                            period={screener.period}
                            results={screener.results}
                        />
                    </section>
                )}
            </div>
        </main>
    );
}

export default Screener;