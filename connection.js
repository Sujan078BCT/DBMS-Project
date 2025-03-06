// establish database connection
const mysql = require('mysql2');
require('dotenv').config();//loads environment variable from .env file into process.env
const dbConfig = {
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:"pg_database"
}
const connection = mysql.createConnection(dbConfig);

module.exports = connection;