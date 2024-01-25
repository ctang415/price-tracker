const asyncHandler = require('express-async-handler')
const db = require('../connection')
const queryDatabase = require('../querydb')

exports.table_create_post = asyncHandler(async (req, res, next) => {
    let sql = `CREATE TABLE myproducts(
        id INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(150),
        price INT,
        lowest_price INT,
        lowest_price_date timestamp DEFAULT (current_timestamp),
        url VARCHAR(500),
        image_url VARCHAR(500)
        );`

   const query = await queryDatabase(sql);
   
   if (query) {
    return res.status(200).json('Table created!')
   } else {
    return res.status(400).json('Something went wrong.')
   }
})

exports.table_get = asyncHandler( async (req, res, next) => {


    let page = ((req.query.page - 1) * 6);
    let sqlCount = `SELECT COUNT(*) AS COUNT FROM myproducts`

    if (req.query.search) {
        let sql = `SELECT * FROM myproducts ORDER BY ${req.query.search} LIMIT 6 OFFSET ${page}`;
        const query = await Promise.all( [ queryDatabase(sql), queryDatabase(sqlCount)])
        if (query[0].length !== 0) {
            return res.status(200).json(query);
        } else {
            return res.status(404).json({err: "Something went wrong."})
        }
    } else {
        let sql = `SELECT * FROM myproducts ORDER BY id DESC LIMIT 6 OFFSET ${page}`
        const query = await Promise.all( [ queryDatabase(sql), queryDatabase(sqlCount)])
        if (query[0].length !== 0) {
            return res.status(200).json(query);
        } else {
            return res.status(404).json({err: "Something went wrong."})
        }
    }
})