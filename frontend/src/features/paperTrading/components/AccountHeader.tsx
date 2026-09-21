type AccountHeaderProps = { error: string };

export default function AccountHeader({ error }: AccountHeaderProps) {
    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Paper Trading
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Practice trading with virtual money.
                </p>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        </>
    );
}