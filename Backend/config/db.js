const mysql = require('mysql2/promise'); // Note: require('mysql2/promise')
require('dotenv').config();

// Using a connection pool is a best practice for performance and reliability
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(conn => {
        console.log('Connected to MySQL database.');
        conn.release(); // release the connection
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err);
    });

module.exports = pool;