import ScreenerEmptyState from "./components/ScreenerEmptyState";
import ScreenerFilters from "./components/ScreenerFilters";
import ScreenerResultsTable from "./components/ScreenerResultsTable";
import { useScreener } from "./hooks/useScreener";

function Screener() {
    const screener = useScreener();

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Stock Screener</h1>

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

            {screener.loading && <p className="mb-4">Loading...</p>}

            {screener.error && (
                <p className="mb-4 text-red-600">{screener.error}</p>
            )}

            {!screener.loading &&
                !screener.error &&
                screener.results.length === 0 &&
                screener.date && <ScreenerEmptyState />}

            {screener.results.length > 0 && (
                <ScreenerResultsTable
                    period={screener.period}
                    results={screener.results}
                />
            )}
        </div>
    );
}

export default Screener;