import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

let pool = null;

export async function getDatabasePool() {
    if (pool === null) {
        pool = mysql.createPool({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            waitForConnections: true,
            connectionLimit: 10, // You can adjust this value according to your needs
            queueLimit: 0 // No limit for the queue
        });
    }
    return pool;
}
