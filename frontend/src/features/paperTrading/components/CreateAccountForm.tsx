import { useState } from "react";

type CreateAccountFormProps = {
    error: string;
    isCreating: boolean;
    onCreate: (balance: number) => void;
};

export default function CreateAccountForm({
    error,
    isCreating,
    onCreate,
}: CreateAccountFormProps) {
    const [initialBalance, setInitialBalance] = useState("100000");

    return (
        <div className="mx-auto max-w-lg">
            <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Get Started
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    Create your paper account
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose your virtual starting balance and begin simulating
                    trades.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <label
                    htmlFor="initialBalance"
                    className="block text-sm font-semibold text-slate-700"
                >
                    Initial Balance
                </label>

                <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                        ₹
                    </span>

                    <input
                        id="initialBalance"
                        type="number"
                        min="1"
                        step="0.01"
                        value={initialBalance}
                        onChange={(event) =>
                            setInitialBalance(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => onCreate(Number(initialBalance))}
                    disabled={isCreating}
                    className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                    {isCreating ? "Creating account..." : "Create Paper Account"}
                </button>
            </div>
        </div>
    );
}