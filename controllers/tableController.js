const asyncHandler = require('express-async-handler')
const db = require('../connection')

exports.table_create_post = asyncHandler(async (req, res, next) => {
    let sql = `CREATE TABLE myproducts(
        id INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(150),
        price INT,
        lowest_price INT,
        lowest_price_date DATE DEFAULT (CURRENT_DATE),
        url VARCHAR(500),
        image_url VARCHAR(500)
        );`
    const createTable = () => {
        return new Promise ( (resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
        })
    }
   const query = await createTable();
   
   if (query) {
    return res.status(200).json('Table created!')
   } else {
    return res.status(400).json('Something went wrong.')
   }
})

exports.table_get = asyncHandler( async (req, res, next) => {
    const getAllProducts = () => {
    let sql = `SELECT * FROM myproducts`
        return new Promise ((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
            })
        })
    };

    const query = await getAllProducts()

    if (query.length !== 0) {
        return res.status(200).json(query);
    } else {
        return res.status(404)
    }
})