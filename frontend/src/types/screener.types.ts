export type ScreenerPeriod =
  "daily" |
  "weekly" |
  "monthly";

export type ScreenerType =
  "gainers" |
  "losers";

export type ScreenerLimit =
  5 |
  10 |
  20;

export interface ScreenerResult {
  symbol: string;
  company_name: string;
  start_price: number;
  end_price: number;
  percentage_change: number;
  trading_date?: string;
  start_date?: string;
  end_date?: string;
}