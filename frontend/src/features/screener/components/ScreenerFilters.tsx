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
        <div className="mb-6 flex flex-wrap gap-4">
            <div>
                <label className="mb-1 block">Period</label>
                <select
                    value={period}
                    onChange={(event) =>
                        onPeriodChange(event.target.value as ScreenerPeriod)
                    }
                    className="rounded border p-2"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block">Type</label>
                <select
                    value={type}
                    onChange={(event) =>
                        onTypeChange(event.target.value as ScreenerType)
                    }
                    className="rounded border p-2"
                >
                    <option value="gainers">Gainers</option>
                    <option value="losers">Losers</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block">Date</label>
                <input
                    type="date"
                    value={date}
                    min={minDate}
                    max={maxDate}
                    disabled={dateLoading}
                    onChange={(event) => onDateChange(event.target.value)}
                    className="rounded border p-2"
                />
            </div>

            <div>
                <label className="mb-1 block">Results</label>
                <select
                    value={limit}
                    onChange={(event) =>
                        onLimitChange(Number(event.target.value) as ScreenerLimit)
                    }
                    className="rounded border p-2"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
        </div>
    );
}