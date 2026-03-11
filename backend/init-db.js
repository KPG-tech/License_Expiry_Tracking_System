const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        const sqlFilePath = path.join(__dirname, 'database.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        console.log('Executing database.sql...');
        await connection.query(sql);
        console.log('Database initialized successfully.');

        await connection.end();
    } catch (err) {
        console.error('Error executing database setup:', err);
    }
}

run();
