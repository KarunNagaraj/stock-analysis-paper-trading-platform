export default function ScreenerEmptyState() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M4 19V5" />
                    <path d="M4 19h16" />
                    <path d="m8 15 3-4 3 2 5-6" />
                </svg>
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
                No results found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                There are no matching stocks for the selected filters.
            </p>
        </div>
    );
}