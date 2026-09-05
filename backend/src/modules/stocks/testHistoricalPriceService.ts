import { getHistoricalPricesService } from "./historicalPrice.service.js";

async function testService() {
  try {
    const prices = await getHistoricalPricesService(
      "reliance",
      "2024-01-01",
      "2024-12-31"
    );

    console.log(prices.slice(0, 5));
    console.log(`Total records: ${prices.length}`);
  } catch (error) {
    console.error(
      "Failed to retrieve historical prices:",
      error
    );
  }
}

testService();