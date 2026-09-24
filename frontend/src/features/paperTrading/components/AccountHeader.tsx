type AccountHeaderProps = {
    error: string;
};

export default function AccountHeader({ error }: AccountHeaderProps) {
    return (
        <>
            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Simulated Investing
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Paper Trading
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Practice trades with virtual capital using live market prices.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}
        </>
    );
}