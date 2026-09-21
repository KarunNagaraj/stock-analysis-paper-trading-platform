import { useEffect, useState } from "react";
import {
    createPaperAccount,
    getPaperAccount,
    resetPaperAccount,
} from "../../../services/paperTradingService";
import type { PaperAccount } from "../../../types/paperTrading";

type AccountAction = "create" | "reset";

type ApiError = {
    response?: {
        status?: number;
        data?: { message?: string };
    };
};

export function usePaperAccount() {
    const [account, setAccount] = useState<PaperAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAccount() {
            try {
                setAccount(await getPaperAccount());
            } catch (error: unknown) {
                const apiError = error as ApiError;
                if (apiError.response?.status !== 404) {
                    setError("Failed to load paper trading account");
                }
            } finally {
                setIsLoading(false);
            }
        }
        loadAccount();
    }, []);

    async function saveAccount(action: AccountAction, initialBalance: number) {
        setError("");
        if (!Number.isFinite(initialBalance) || initialBalance <= 0) {
            setError(`Enter a valid ${action} balance`);
            return false;
        }

        try {
            if (action === "create") {
                setIsCreating(true);
            } else {
                setIsResetting(true);
            }

            const nextAccount = action === "create"
                ? await createPaperAccount({ initialBalance })
                : await resetPaperAccount({ initialBalance });
            setAccount(nextAccount);
            return true;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            setError(
                apiError.response?.data?.message ||
                `Failed to ${action} paper trading account`
            );
            return false;
        } finally {
            setIsCreating(false);
            setIsResetting(false);
        }
    }

    return {
        account,
        error,
        isLoading,
        isCreating,
        isResetting,
        createAccount: (initialBalance: number) =>
            saveAccount("create", initialBalance),
        resetAccount: (initialBalance: number) =>
            saveAccount("reset", initialBalance),
    };
}