import "dotenv/config";

import { syncAllStocksHistoricalPrices } from "../src/modules/stocks/historicalPrice.service.js";

async function main() {
  const today = new Date()
    .toISOString()
    .slice(0, 10);

  const result =
    await syncAllStocksHistoricalPrices(today, 5);

  console.log("SYNC COMPLETE");
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

 