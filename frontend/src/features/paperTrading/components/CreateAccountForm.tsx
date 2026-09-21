import { useState } from "react";

type CreateAccountFormProps = {
    error: string;
    isCreating: boolean;
    onCreate: (balance: number) => void;
};

export default function CreateAccountForm({ error, isCreating, onCreate }: CreateAccountFormProps) {
    const [initialBalance, setInitialBalance] = useState("100000");

    return (
        <div className="mx-auto max-w-lg">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Create Paper Trading Account
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Set the amount of virtual cash you want to start with.
                </p>

                <label
                    htmlFor="initialBalance"
                    className="mt-6 block text-sm font-medium text-gray-700"
                >
                    Initial Balance
                </label>
                <input
                    id="initialBalance"
                    type="number"
                    min="1"
                    step="0.01"
                    value={initialBalance}
                    onChange={(event) => setInitialBalance(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <button
                    onClick={() => onCreate(Number(initialBalance))}
                    disabled={isCreating}
                    className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isCreating ? "Creating..." : "Create Paper Account"}
                </button>
            </div>
        </div>
    );
}