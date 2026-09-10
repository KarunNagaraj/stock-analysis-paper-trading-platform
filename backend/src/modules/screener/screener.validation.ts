export const SCREENER_PERIODS = [
  "daily",
  "weekly",
  "monthly",
] as const;

export const SCREENER_TYPES = [
  "gainers",
  "losers",
] as const;

export const SCREENER_LIMITS = [
  5,
  10,
  20,
] as const;

export type ScreenerPeriod =
  (typeof SCREENER_PERIODS)[number];

export type ScreenerType =
  (typeof SCREENER_TYPES)[number];

export function validateScreenerParams(
  period: string,
  type: string,
  date: string,
  limit: string
) {
  if (!SCREENER_PERIODS.includes(period as ScreenerPeriod)) {
    throw new Error("Invalid screener period");
  }

  if (!SCREENER_TYPES.includes(type as ScreenerType)) {
    throw new Error("Invalid screener type");
  }

  const parsedLimit = Number(limit);

  if (
    !SCREENER_LIMITS.includes(
      parsedLimit as typeof SCREENER_LIMITS[number]
    )
  ) {
    throw new Error("Invalid screener limit");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date");
  }

  return {
    period: period as ScreenerPeriod,
    type: type as ScreenerType,
    date,
    limit: parsedLimit,
  };
}