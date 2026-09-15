import { YahooFinanceProvider } from "./yahooFinance.provider.js";

// The class is the blueprint; this shared instance is the object services will use.
const marketDataProvider = new YahooFinanceProvider();

export default marketDataProvider;
