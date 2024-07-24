import mysql from 'mysql2/promise.js';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1@harpur",
    database: "adverts",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;