export function formatCurrency(value: number | string) {
    return `₹${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function formatPnl(value: number) {
    return `${value >= 0 ? "+" : ""}${formatCurrency(value)}`;
}