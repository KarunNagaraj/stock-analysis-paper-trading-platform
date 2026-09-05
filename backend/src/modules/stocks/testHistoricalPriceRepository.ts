import { getHistoricalPrices } from "./historicalPrice.repository.js";

async function testRepository() {
    try {
        const prices = await getHistoricalPrices("RELIANCE");

        console.log(prices.slice(0, 5));
    } catch (error) {
        console.error("Failed to retrieve historical prices:", error);
    }
}

testRepository();