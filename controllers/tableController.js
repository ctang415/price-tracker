const asyncHandler = require('express-async-handler')
const db = require('../connection')

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
    const getCount = () => {
    let sql = `SELECT COUNT(*) AS COUNT FROM myproducts`
        return new Promise ((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
            })
        })
    };

    const getAllProducts = () => {
        let page = ((req.params.page - 1) * 6);
        let sql = `SELECT * FROM myproducts ORDER BY id DESC LIMIT 6 OFFSET ${page}`
        return new Promise ((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
            })
        })
    }

    const query = await Promise.all( [ getAllProducts(), getCount()])

    if (query[0].length !== 0) {
        return res.status(200).json(query);
    } else {
        return res.status(404)
    }
})

exports.table_get_specific = asyncHandler ( async (req, res, next) => {
    let page = ((req.params.page - 1) * 6)
    let sql = `SELECT * FROM myproducts ORDER BY ${req.params.search} LIMIT 6 OFFSET ${page}`
    const getFilteredProducts = async () => {
        return new Promise( (resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) throw reject(err)
                return resolve(results)
            })
        })
    }
    const getCount = () => {
        let sql = `SELECT COUNT(*) AS COUNT FROM myproducts`
            return new Promise ((resolve, reject) => {
                db.query(sql, (err, result) => {
                    if (err) return reject(err)
                    return resolve(result)
                })
            })
        };

    const query = await Promise.all([ getFilteredProducts(), getCount() ]);
    if (query[0].length !== 0) {
        return res.status(200).json(query)
    } else {
        return res.status(404)
    }
})