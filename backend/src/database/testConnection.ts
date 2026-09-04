import pool from './db.js';

async function testConnection() {
    try {
        const [results] = await pool.query('SELECT 1');

        console.log("database query worked");
        console.log(results);
    }
    catch(error) {
        console.log("Error on database connection test",error);

    }
    finally {
        await pool.end();
    }

}

testConnection();