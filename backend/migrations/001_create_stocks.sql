CREATE TABLE stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    exchange VARCHAR(50) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(150)
);