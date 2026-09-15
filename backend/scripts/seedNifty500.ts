import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

import pool from "../src/database/db.js";

// --------------------------------------------------
// Load Nifty 500 stocks from CSV
// --------------------------------------------------

function loadStocks() {
    const csvPath = path.resolve(
        process.cwd(),
        "data/nifty500.csv"
    );

    const csv = fs.readFileSync(csvPath, "utf-8");

    const records = parse(csv, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    if (records.length === 0) {
        throw new Error("Nifty 500 CSV is empty.");
    }

    console.log("CSV columns:");
    console.log(Object.keys(records[0]));

    const stocks = records
        .map((row: Record<string, string>) => ({
            symbol: row["Symbol"]?.trim(),
            companyName: row["Company Name"]?.trim(),
            industry: row["Industry"]?.trim(),
        }))
        .filter(
            stock =>
                stock.symbol &&
                stock.companyName
        );

    return stocks;
}

// --------------------------------------------------
// Seed stocks
// --------------------------------------------------

async function seedNifty500() {
    console.log("Loading Nifty 500 stocks...");

    const stocks = loadStocks();

    console.log(`Loaded ${stocks.length} stocks`);

    // --------------------------------------------------
    // Prepare batch values
    // --------------------------------------------------

    const stockValues = stocks.map(stock => [
        stock.symbol,
        `${stock.symbol}.NS`,
        stock.companyName,
        "NSE",
        stock.industry || null,
    ]);

    // --------------------------------------------------
    // Insert / update stocks
    // --------------------------------------------------

    await pool.query(
        `
        INSERT INTO stocks
        (
            symbol,
            provider_symbol,
            company_name,
            exchange,
            industry
        )
        VALUES ?
        ON DUPLICATE KEY UPDATE
            provider_symbol = VALUES(provider_symbol),
            company_name = VALUES(company_name),
            exchange = VALUES(exchange),
            industry = VALUES(industry)
        `,
        [stockValues]
    );

    console.log(
        `Successfully seeded ${stocks.length} stocks.`
    );
}

// --------------------------------------------------
// Main
// --------------------------------------------------

seedNifty500()
    .catch(error => {
        console.error("Nifty 500 seed failed:");
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });