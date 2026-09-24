import type {
    ScreenerLimit,
    ScreenerPeriod,
    ScreenerType,
} from "../../../types/screener.types";

type ScreenerFiltersProps = {
    period: ScreenerPeriod;
    onPeriodChange: (period: ScreenerPeriod) => void;
    type: ScreenerType;
    onTypeChange: (type: ScreenerType) => void;
    date: string;
    minDate: string;
    maxDate: string;
    dateLoading: boolean;
    onDateChange: (date: string) => void;
    limit: ScreenerLimit;
    onLimitChange: (limit: ScreenerLimit) => void;
};

export default function ScreenerFilters({
    period,
    onPeriodChange,
    type,
    onTypeChange,
    date,
    minDate,
    maxDate,
    dateLoading,
    onDateChange,
    limit,
    onLimitChange,
}: ScreenerFiltersProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Period
                </label>

                <select
                    value={period}
                    onChange={(event) =>
                        onPeriodChange(event.target.value as ScreenerPeriod)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Direction
                </label>

                <select
                    value={type}
                    onChange={(event) =>
                        onTypeChange(event.target.value as ScreenerType)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                    <option value="gainers">Gainers</option>
                    <option value="losers">Losers</option>
                </select>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Trading Date
                </label>

                <input
                    type="date"
                    value={date}
                    min={minDate}
                    max={maxDate}
                    disabled={dateLoading}
                    onChange={(event) => onDateChange(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Results
                </label>

                <select
                    value={limit}
                    onChange={(event) =>
                        onLimitChange(Number(event.target.value) as ScreenerLimit)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                    <option value={5}>5 results</option>
                    <option value={10}>10 results</option>
                    <option value={20}>20 results</option>
                </select>
            </div>
        </div>
    );
}