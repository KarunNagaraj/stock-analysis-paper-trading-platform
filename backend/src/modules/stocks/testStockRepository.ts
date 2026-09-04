import { getAllStocks } from "./stock.repository.js";

async function testRepository() {
  try {
    const stocks = await getAllStocks();

    console.log("Stocks retrieved:");
    console.log(stocks);
  } catch (error) {
    console.error("Failed to retrieve stocks:", error);
  }
}

testRepository();