CREATE TABLE paper_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    account_id INT NOT NULL,
    stock_id INT NOT NULL,

    side ENUM('BUY', 'SELL') NOT NULL,
    order_type ENUM('MARKET') NOT NULL DEFAULT 'MARKET',

    quantity INT NOT NULL,

    status ENUM(
        'PENDING',
        'EXECUTED',
        'CANCELLED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP NULL,

    CONSTRAINT fk_paper_orders_account
        FOREIGN KEY (account_id)
        REFERENCES paper_accounts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_paper_orders_stock
        FOREIGN KEY (stock_id)
        REFERENCES stocks(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_paper_orders_quantity
        CHECK (quantity > 0)
);
