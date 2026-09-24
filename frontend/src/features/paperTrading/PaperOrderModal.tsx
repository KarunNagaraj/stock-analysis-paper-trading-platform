import { useState } from "react";
import {
    placePaperOrder,
    type PaperOrderSide,
} from "../../services/paperTradingService";

type PaperOrderModalProps = {
    symbol: string;
    side: PaperOrderSide;
    currentPrice: number;
    onClose: () => void;
    onSuccess: () => void;
};

export default function PaperOrderModal({
    symbol,
    side,
    currentPrice,
    onClose,
    onSuccess,
}: PaperOrderModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isBuy = side === "BUY";
    const estimatedValue = currentPrice * quantity;

    async function handlePlaceOrder() {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            setError("Quantity must be a positive whole number");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await placePaperOrder({
                symbol,
                side,
                quantity,
            });

            onSuccess();
        } catch (error: unknown) {
            const responseError = error as {
                response?: {
                    data?: {
                        error?: string;
                    };
                };
            };

            setError(
                responseError.response?.data?.error ||
                    "Failed to place order"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span
                                className={
                                    isBuy
                                        ? "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-700"
                                        : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-red-700"
                                }
                            >
                                {isBuy ? "Buy" : "Sell"}
                            </span>

                            <span className="text-xs text-slate-400">
                                Market Order
                            </span>
                        </div>

                        <h2 className="mt-2 text-xl font-bold text-slate-900">
                            {symbol}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close order dialog"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-5 px-6 py-6">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Current Price
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            ₹
                            {currentPrice.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="paper-order-quantity"
                            className="block text-sm font-semibold text-slate-700"
                        >
                            Quantity
                        </label>

                        <input
                            id="paper-order-quantity"
                            type="number"
                            min="1"
                            step="1"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(Number(event.target.value))
                            }
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                        <span className="text-sm text-slate-500">
                            Estimated Value
                        </span>

                        <span className="text-base font-bold text-slate-900">
                            ₹
                            {estimatedValue.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
                            isBuy
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {loading
                            ? "Processing..."
                            : isBuy
                              ? "Confirm Buy"
                              : "Confirm Sell"}
                    </button>
                </div>
            </div>
        </div>
    );
}
