export const SCREENER_PERIODS = ["daily", "weekly", "monthly"] as const;
export const SCREENER_TYPES = ["gainers", "losers", "volume_spikes"] as const;
export const SCREENER_LIMITS = [5, 10, 20] as const;
export const MAX_SCREENER_LIMIT = 20;

export type ScreenerPeriod = (typeof SCREENER_PERIODS)[number];
export type ScreenerType = (typeof SCREENER_TYPES)[number];
