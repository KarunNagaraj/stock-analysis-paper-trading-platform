CREATE TABLE fundamentals (
    id INT AUTO_INCREMENT PRIMARY KEY,

    stock_id INT NOT NULL UNIQUE,

    market_cap DECIMAL(20, 2),
    pe_ratio DECIMAL(10, 2),
    pb_ratio DECIMAL(10, 2),
    eps DECIMAL(15, 4),

    roe DECIMAL(10, 2),
    roce DECIMAL(10, 2),
    profit_margin DECIMAL(10, 2),

    revenue_growth DECIMAL(10, 2),
    profit_growth DECIMAL(10, 2),

    debt_to_equity DECIMAL(10, 2),
    dividend_yield DECIMAL(10, 2),

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_fundamentals_stock
        FOREIGN KEY (stock_id)
        REFERENCES stocks(id)
        ON DELETE CASCADE
);