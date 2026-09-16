CREATE TABLE paper_positions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    account_id INT NOT NULL,
    stock_id INT NOT NULL,

    quantity INT NOT NULL,
    average_price DECIMAL(15, 4) NOT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_paper_positions_account
        FOREIGN KEY (account_id)
        REFERENCES paper_accounts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_paper_positions_stock
        FOREIGN KEY (stock_id)
        REFERENCES stocks(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_paper_positions_account_stock
        UNIQUE (account_id, stock_id),

    CONSTRAINT chk_paper_positions_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_paper_positions_average_price
        CHECK (average_price >= 0)
);
