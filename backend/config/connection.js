import mysql from 'mysql2/promise.js';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "adverts",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;