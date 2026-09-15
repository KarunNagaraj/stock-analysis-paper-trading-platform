import "dotenv/config";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import YahooFinance from "yahoo-finance2";

import type { RowDataPacket } from "mysql2";

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const yahooFinance = new YahooFinance({
    suppressNotices: ["yahooSurvey"],
});

const FROM = "2021-01-01";

// Yahoo's period2 is effectively exclusive.
// This includes data available up to this date.
const TO = "2026-09-15";

const CONCURRENCY = 5;

// --------------------------------------------------
// Database types
// --------------------------------------------------

interface StockRow extends RowDataPacket {
    id: number;
    symbol: string;
    provider_symbol: string;
}

// --------------------------------------------------
// Format Yahoo date
// --------------------------------------------------

function formatTradingDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// --------------------------------------------------
// Process one stock
// --------------------------------------------------

async function processStock(
    stock: StockRow,
    connection: mysql.Connection
) {
    const totalStart = performance.now();

    try {
        // ------------------------------------------
        // Fetch historical data from Yahoo
        // ------------------------------------------

        const fetchStart = performance.now();

        const result = await yahooFinance.chart(
            stock.provider_symbol,
            {
                period1: FROM,
                period2: TO,
                interval: "1d",
                includePrePost: false,
            }
        );

        const fetchTime =
            performance.now() - fetchStart;

        // ------------------------------------------
        // Remove incomplete candles
        // ------------------------------------------

        const rows = (
            result?.quotes || []
        ).filter(
            row =>
                row.date &&
                row.open != null &&
                row.high != null &&
                row.low != null &&
                row.close != null
        );

        if (rows.length === 0) {
            return {
                symbol: stock.symbol,
                status: "NO_DATA" as const,
                rows: 0,
                fetchTime,
                insertTime: 0,
                totalTime:
                    performance.now() - totalStart,
            };
        }

        // ------------------------------------------
        // Prepare database values
        // ------------------------------------------

        const values = rows.map(row => [
            stock.id,
            formatTradingDate(row.date),
            row.open,
            row.high,
            row.low,
            row.close,
            row.volume ?? null,
        ]);

        // ------------------------------------------
        // Insert into historical_prices
        // ------------------------------------------

        const insertStart = performance.now();

        await connection.query(
            `
            INSERT INTO historical_prices
            (
                stock_id,
                trading_date,
                open_price,
                high_price,
                low_price,
                close_price,
                volume
            )
            VALUES ?
            ON DUPLICATE KEY UPDATE
                open_price = VALUES(open_price),
                high_price = VALUES(high_price),
                low_price = VALUES(low_price),
                close_price = VALUES(close_price),
                volume = VALUES(volume)
            `,
            [values]
        );

        const insertTime =
            performance.now() - insertStart;

        const totalTime =
            performance.now() - totalStart;

        return {
            symbol: stock.symbol,
            status: "SUCCESS" as const,
            rows: rows.length,
            fetchTime,
            insertTime,
            totalTime,
        };

    } catch (error) {
        return {
            symbol: stock.symbol,
            status: "FAILED" as const,
            rows: 0,
            fetchTime: 0,
            insertTime: 0,
            totalTime:
                performance.now() - totalStart,
            error:
                error instanceof Error
                    ? error.message
                    : String(error),
        };
    }
}

// --------------------------------------------------
// Worker pool
// --------------------------------------------------

async function runWithConcurrency(
    stocks: StockRow[],
    connection: mysql.Connection
) {
    const results: Awaited<
        ReturnType<typeof processStock>
    >[] = [];

    let nextIndex = 0;

    async function worker() {
        while (true) {
            const index = nextIndex++;

            if (index >= stocks.length) {
                return;
            }

            const stock = stocks[index];

            const result = await processStock(
                stock,
                connection
            );

            results[index] = result;

            if (result.status === "SUCCESS") {
                console.log(
                    `${result.symbol.padEnd(18)} ` +
                    `SUCCESS | ` +
                    `${String(result.rows).padStart(5)} rows | ` +
                    `fetch: ${result.fetchTime.toFixed(0)} ms | ` +
                    `insert: ${result.insertTime.toFixed(0)} ms | ` +
                    `total: ${result.totalTime.toFixed(0)} ms`
                );
            }

            else if (result.status === "NO_DATA") {
                console.log(
                    `${result.symbol.padEnd(18)} ` +
                    `NO DATA | ` +
                    `fetch: ${result.fetchTime.toFixed(0)} ms`
                );
            }

            else {
                console.log(
                    `${result.symbol.padEnd(18)} ` +
                    `FAILED | ` +
                    `${result.error}`
                );
            }
        }
    }

    const workers: Promise<void>[] = [];

    for (
        let i = 0;
        i < CONCURRENCY;
        i++
    ) {
        workers.push(worker());
    }

    await Promise.all(workers);

    return results;
}

// --------------------------------------------------
// Main
// --------------------------------------------------

async function main() {
    const totalStart = performance.now();

    console.log(
        "Loading stocks from database..."
    );

    // ----------------------------------------------
    // Connect to MySQL
    // ----------------------------------------------

    const connection =
        await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(
                process.env.DB_PORT
            ),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

    // ----------------------------------------------
    // Load stocks
    // ----------------------------------------------

    const [stocks] =
        await connection.query<StockRow[]>(
            `
            SELECT
                id,
                symbol,
                provider_symbol
            FROM stocks
            WHERE provider_symbol IS NOT NULL
            ORDER BY id
            `
        );

    console.log(
        `Loaded ${stocks.length} stocks`
    );

    console.log(
        `Historical range: ${FROM} -> ${TO}`
    );

    console.log(
        `Yahoo concurrency: ${CONCURRENCY}`
    );

    console.log(
        "--------------------------------------------------"
    );

    // ----------------------------------------------
    // Run workers
    // ----------------------------------------------

    const results =
        await runWithConcurrency(
            stocks,
            connection
        );

    const totalTime =
        performance.now() - totalStart;

    // ----------------------------------------------
    // Statistics
    // ----------------------------------------------

    const successful =
        results.filter(
            result =>
                result.status === "SUCCESS"
        );

    const noData =
        results.filter(
            result =>
                result.status === "NO_DATA"
        );

    const failed =
        results.filter(
            result =>
                result.status === "FAILED"
        );

    const totalRows =
        successful.reduce(
            (sum, result) =>
                sum + result.rows,
            0
        );

    const totalFetchTime =
        successful.reduce(
            (sum, result) =>
                sum + result.fetchTime,
            0
        );

    const totalInsertTime =
        successful.reduce(
            (sum, result) =>
                sum + result.insertTime,
            0
        );

    const averageFetch =
        successful.length > 0
            ? totalFetchTime /
              successful.length
            : 0;

    const averageRows =
        successful.length > 0
            ? totalRows /
              successful.length
            : 0;

    // ----------------------------------------------
    // Final report
    // ----------------------------------------------

    console.log(
        "\n=================================================="
    );

    console.log(
        "FINAL SUMMARY"
    );

    console.log(
        "=================================================="
    );

    console.log(
        `Stocks processed:   ${stocks.length}`
    );

    console.log(
        `Successful:         ${successful.length}`
    );

    console.log(
        `No data:            ${noData.length}`
    );

    console.log(
        `Failed:             ${failed.length}`
    );

    console.log(
        `Yahoo rows:         ${totalRows}`
    );

    console.log(
        "\nTIMING"
    );

    console.log(
        "--------------------------------------------------"
    );

    console.log(
        `Wall-clock runtime: ${(totalTime / 1000).toFixed(2)} seconds`
    );

    console.log(
        `Yahoo request time: ${(totalFetchTime / 1000).toFixed(2)} seconds`
    );

    console.log(
        `DB insertion time:  ${(totalInsertTime / 1000).toFixed(2)} seconds`
    );

    console.log(
        `Average Yahoo:      ${averageFetch.toFixed(0)} ms`
    );

    console.log(
        `Average rows/stock: ${averageRows.toFixed(0)}`
    );

    console.log(
        "=================================================="
    );

    // ----------------------------------------------
    // No-data stocks
    // ----------------------------------------------

    if (noData.length > 0) {
        console.log(
            "\nNO DATA STOCKS"
        );

        console.log(
            "----------------"
        );

        for (const result of noData) {
            console.log(
                result.symbol
            );
        }
    }

    // ----------------------------------------------
    // Failed stocks
    // ----------------------------------------------

    if (failed.length > 0) {
        console.log(
            "\nFAILED STOCKS"
        );

        console.log(
            "----------------"
        );

        for (const result of failed) {
            console.log(
                `${result.symbol}: ${result.error}`
            );
        }
    }

    await connection.end();
}

// --------------------------------------------------
// Start
// --------------------------------------------------

main().catch(error => {
    console.error(
        "\nFATAL ERROR"
    );

    console.error(error);

    process.exitCode = 1;
});