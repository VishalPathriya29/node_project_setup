import mysql from 'mysql2';
import 'dotenv/config';
import log from './helper/logger';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // connectTimeout: 10000,
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    log.info("Database connected successfully");
    connection.release();
});

export default pool.promise();