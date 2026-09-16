import {
  syncAllStocksHistoricalPrices,
} from "../modules/stocks/historicalPrice.service.js";

function getTodayDate() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function getCurrentHour() {
  return new Date().getHours();
}

async function runScheduledSync() {
  const hour = getCurrentHour();

  /*
   * Run only between 09:00 and 15:59.
   */
  if (hour < 9 || hour > 15) {
    return;
  }

  const today = getTodayDate();

  console.log(
    `[SCHEDULED SYNC] Starting full sync for ${today}`
  );

  try {
    const result =
      await syncAllStocksHistoricalPrices(
        today
      );

    console.log(
      "[SCHEDULED SYNC] Complete:",
      result
    );
  } catch (error) {
    console.error(
      "[SCHEDULED SYNC] Failed:",
      error
    );
  }
}

export function startScreenerMarketSyncJob() {
  /*
   * Run once when the backend starts.
   */
  runScheduledSync();

  /*
   * Check every minute whether an hourly sync
   * should run.
   */
  setInterval(() => {
    const now = new Date();

    const minute =
      now.getMinutes();

    const hour =
      now.getHours();

    if (
      minute === 0 &&
      hour >= 9 &&
      hour <= 15
    ) {
      runScheduledSync();
    }
  }, 60 * 1000);
}