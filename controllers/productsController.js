const db = require('../connection');
const asyncHandler = require('express-async-handler')

exports.product_get = asyncHandler( async (req, res, next) => {
    const getProduct = () => {
        let sql = `SELECT * FROM myproducts WHERE id = ${req.params.productid} `
        return new Promise( (resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
        })
    }
    )};
    
    const query = await getProduct();
    
    if (query.length !== 0) {
        return res.status(200).json(product)
    } else {
        return res.status(404)
    }
})

exports.product_create = asyncHandler( async (req, res, next) => {
    const insertProduct = () => {
        let sql = `INSERT INTO myproducts (name, price, lowest_price, url, image_url) 
        VALUES (${req.name}, ${req.price}, ${req.price}, ${req.url}, ${req.image})`
        return new Promise ( (resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
            } )
        })
    };

    const query = await insertProduct();

    if (query.length !== 0) {
        return res.status(200).json({data: product, msg: 'Product successfully added!'})
    } else {
        return res.status(404)    
    }
})

exports.product_test = asyncHandler( async (req, res, next) => {
    let sql = "INSERT INTO myproducts (name, price, lowest_price, url, image_url) VALUES ('HIKING STICKS', 55, 55, 'https://www.amazon.com/gp/product/B07DYKZD7X?th=1', 'https://m.media-amazon.com/images/I/6134PIDPt0L._AC_SL1200_.jpg')"
    const insertTestProduct = () => {
    return new Promise ( (resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                return resolve(result)
            } )
        })
    };

    const query = await insertTestProduct();

    if (query.length !== 0) {
        return console.log(query)
    } else {
        return console.log('no')
    }
})

exports.product_put = asyncHandler( async (req, res, next) => {
    let updateSql = `UPDATE myproducts
            SET price = ${req.price},
            lowest_price = ${req.price}, 
            lowest_price_date = CURRENT_DATE
            WHERE url = ${req.url}`;
        
            let sql = `UPDATE myproducts
            SET price = ${req.price}
            WHERE url = ${req.url}`;

    const updateProduct = () => {
        return new Promise ( (resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
            })
        })
    };

    const query = await updateProduct();

    if (query.length !== 0) {
        return res.status(200).json(query)
    }  else {
        return res.status(404)
    }
})

exports.product_delete = asyncHandler( async (req, res, next) => {
    let sql = `DELETE FROM myproducts where id = ${req.params.productid}`
    const deleteProduct = () => {
        return new Promise ( (resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                return resolve(result)
            });
        });
    };

    const query = await deleteProduct();

    if (query.length !== 0) {
        return res.status(200).json({msg: 'Product successfully removed!'})
    } else {
        return res.status(404);
    }

})