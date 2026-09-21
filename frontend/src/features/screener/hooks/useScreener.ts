import { useEffect, useState } from "react";
import {
    getScreenerDateRange,
    getScreenerResults,
} from "../../../services/screenerService";
import type {
    ScreenerLimit,
    ScreenerPeriod,
    ScreenerResult,
    ScreenerType,
} from "../../../types/screener.types";

type ScreenerApiError = {
    response?: {
        data?: {
            error?: string;
        };
    };
};

export function useScreener() {
    const [period, setPeriod] = useState<ScreenerPeriod>("daily");
    const [type, setType] = useState<ScreenerType>("gainers");
    const [date, setDate] = useState("");
    const [limit, setLimit] = useState<ScreenerLimit>(5);
    const [results, setResults] = useState<ScreenerResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [dateLoading, setDateLoading] = useState(true);

    useEffect(() => {
        async function loadDateRange() {
            try {
                const data = await getScreenerDateRange();

                setMinDate(data.min_date);
                setMaxDate(data.max_date);
                setDate(data.max_date);
            } catch {
                setError("Failed to load historical date range");
            } finally {
                setDateLoading(false);
            }
        }

        loadDateRange();
    }, []);

    useEffect(() => {
        if (!date) {
            return;
        }

        async function runScreener() {
            try {
                setLoading(true);
                setError("");

                const data = await getScreenerResults(
                    period,
                    type,
                    date,
                    limit
                );

                setResults(data);
            } catch (error: unknown) {
                const apiError = error as ScreenerApiError;

                setResults([]);
                setError(
                    apiError.response?.data?.error ||
                    "Failed to run screener"
                );
            } finally {
                setLoading(false);
            }
        }

        runScreener();
    }, [period, type, date, limit]);

    return {
        period,
        setPeriod,
        type,
        setType,
        date,
        setDate,
        limit,
        setLimit,
        results,
        loading,
        error,
        minDate,
        maxDate,
        dateLoading,
    };
}