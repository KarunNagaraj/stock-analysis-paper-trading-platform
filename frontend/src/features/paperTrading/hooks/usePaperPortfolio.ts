import { useEffect, useState } from "react";
import { getPaperPortfolio } from "../../../services/paperTradingService";
import type { PaperPortfolio } from "../../../types/paperPortfolio.types";

export function usePaperPortfolio(hasAccount: boolean) {
    const [portfolio, setPortfolio] = useState<PaperPortfolio | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!hasAccount) return;
        async function loadPortfolio() {
            try {
                setIsLoading(true);
                setError(null);
                setPortfolio(await getPaperPortfolio());
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load portfolio"
                );
            } finally {
                setIsLoading(false);
            }
        }
        loadPortfolio();
    }, [hasAccount]);

    return { portfolio, isLoading, error };
}