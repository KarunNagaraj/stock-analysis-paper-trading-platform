import mysql from "mysql2/promise";
import 'dotenv/config'; // Load environment variables from .env file

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

//The pool maintains a collection of database connections and gives one to your code when needed. The pool handles the available connections rather than us manually creating/destroying connections for every request.

export default pool;