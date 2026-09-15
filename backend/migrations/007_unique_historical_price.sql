ALTER TABLE historical_prices
ADD CONSTRAINT uq_historical_prices_stock_date
UNIQUE (stock_id, trading_date);