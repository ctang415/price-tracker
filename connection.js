require('dotenv').config()
const mysql = require('mysql2')

const db = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
})



module.exports = db