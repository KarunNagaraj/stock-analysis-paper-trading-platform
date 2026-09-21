export interface PaperPortfolioPosition {
    stockId: number;
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    investedValue: number;
    marketValue: number;
    unrealizedPnl: number;
}

export interface PaperPortfolio {
    cashBalance: number;
    investedValue: number;
    currentMarketValue: number;
    portfolioValue: number;
    realizedPnl: number;
    unrealizedPnl: number;
    totalPnl: number;
    returnPercentage: number;
    positions: PaperPortfolioPosition[];
}