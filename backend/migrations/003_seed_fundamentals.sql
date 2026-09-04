INSERT INTO fundamentals (
    stock_id,
    market_cap,
    pe_ratio,
    pb_ratio,
    eps,
    roe,
    roce,
    profit_margin,
    revenue_growth,
    profit_growth,
    debt_to_equity,
    dividend_yield
)
SELECT
    id,
    1500000000000,
    28.50,
    12.40,
    45.20,
    46.20,
    52.10,
    19.80,
    12.50,
    15.30,
    0.08,
    0.75
FROM stocks
WHERE symbol = 'TCS';


INSERT INTO fundamentals (
    stock_id,
    market_cap,
    pe_ratio,
    pb_ratio,
    eps,
    roe,
    roce,
    profit_margin,
    revenue_growth,
    profit_growth,
    debt_to_equity,
    dividend_yield
)
SELECT
    id,
    720000000000,
    24.10,
    7.80,
    62.40,
    29.70,
    34.50,
    18.20,
    10.40,
    13.20,
    0.12,
    1.10
FROM stocks
WHERE symbol = 'INFY';


INSERT INTO fundamentals (
    stock_id,
    market_cap,
    pe_ratio,
    pb_ratio,
    eps,
    roe,
    roce,
    profit_margin,
    revenue_growth,
    profit_growth,
    debt_to_equity,
    dividend_yield
)
SELECT
    id,
    2100000000000,
    24.52,
    2.31,
    118.45,
    9.82,
    11.42,
    8.71,
    12.35,
    10.62,
    0.42,
    0.31
FROM stocks
WHERE symbol = 'RELIANCE';