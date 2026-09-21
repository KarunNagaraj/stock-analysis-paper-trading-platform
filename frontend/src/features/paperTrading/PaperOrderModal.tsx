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
  const [, setExecutionPrice] = useState<number | null>(null);

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

      const result = await placePaperOrder({
        symbol,
        side,
        quantity,
      });

      setExecutionPrice(result.executionPrice);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {isBuy ? "Buy" : "Sell"} {symbol}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Market order
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
            aria-label="Close order dialog"
          >
            &times;
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="mt-1 text-xl font-semibold">
            ₹{currentPrice.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="paper-order-quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            id="paper-order-quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-5 flex justify-between text-sm">
          <span className="text-gray-500">Estimated Value</span>
          <span className="font-semibold">
            ₹{estimatedValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`rounded-lg px-5 py-3 font-semibold text-white ${
              isBuy
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {loading
              ? "Processing..."
              : isBuy
                ? "Buy"
                : "Sell"}
          </button>
        </div>
      </div>
    </div>
  );
}
