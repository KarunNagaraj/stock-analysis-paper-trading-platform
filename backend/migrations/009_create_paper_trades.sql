CREATE TABLE paper_trades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    account_id INT NOT NULL,
    order_id BIGINT NOT NULL,
    stock_id INT NOT NULL,

    side ENUM('BUY', 'SELL') NOT NULL,

    quantity INT NOT NULL,
    execution_price DECIMAL(15, 4) NOT NULL,

    realized_pnl DECIMAL(15, 4) NULL,

    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_paper_trades_account
        FOREIGN KEY (account_id)
        REFERENCES paper_accounts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_paper_trades_order
        FOREIGN KEY (order_id)
        REFERENCES paper_orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_paper_trades_stock
        FOREIGN KEY (stock_id)
        REFERENCES stocks(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_paper_trades_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_paper_trades_execution_price
        CHECK (execution_price >= 0)
);
