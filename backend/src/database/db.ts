import mysql from "mysql2/promise";
import 'dotenv/config'; // Load environment variables from .env file
import fs from "fs";

const sslCaPath = process.env.DB_SSL_CA || "./certs/ca.pem";
const sslConfig = process.env.DB_SSL_CA
  ? {
      ca: fs.readFileSync(sslCaPath),
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
    }
  : process.env.DB_SSL_REJECT_UNAUTHORIZED === "false"
    ? { rejectUnauthorized: false }
    : undefined;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslConfig,
});

//The pool maintains a collection of database connections and gives one to your code when needed. The pool handles the available connections rather than us manually creating/destroying connections for every request.

export default pool;