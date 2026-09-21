import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
    });

    try {
        // Create migration tracking table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                migration_name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const migrationsDir = path.resolve('migrations');

        const files = await fs.readdir(migrationsDir);

        const migrationFiles = files
            .filter(file => file.endsWith('.sql'))
            .sort();

        console.log(`Found ${migrationFiles.length} migrations.`);

        for (const file of migrationFiles) {

            // Check whether migration was already executed
            const [rows] = await connection.query(
                `
                SELECT id
                FROM schema_migrations
                WHERE migration_name = ?
                `,
                [file]
            );

            if ((rows as any[]).length > 0) {
                console.log(`Skipping ${file} - already executed.`);
                continue;
            }

            console.log(`Running ${file}...`);

            const filePath = path.join(migrationsDir, file);
            const sql = await fs.readFile(filePath, 'utf-8');

            await connection.query(sql);

            // Record successful migration
            await connection.query(
                `
                INSERT INTO schema_migrations (migration_name)
                VALUES (?)
                `,
                [file]
            );

            console.log(`✓ ${file} completed`);
        }

        console.log('All migrations completed successfully.');
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await connection.end();
    }
}

migrate();