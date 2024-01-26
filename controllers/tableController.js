const queryDatabase = require('../querydb')

exports.table_create_post = (async (req, res, next) => {
    try {
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
    } catch (err) {
        console.log(err)
    }
})

exports.table_get = ( async (req, res, next) => {
    try {
    let page = ((req.query.page - 1) * 6);

    if (req.query.sort) {
        let sql = `SELECT * FROM myproducts ORDER BY ${req.query.sort} LIMIT 6 OFFSET ${page}`;
        let sqlCount = `SELECT COUNT(*) AS COUNT FROM myproducts`
        const query = await Promise.all( [ queryDatabase(sql), queryDatabase(sqlCount)])
        if (query[0].length !== 0) {
            return res.status(200).json(query);
        } else {
            return res.status(404).json({err: "Something went wrong."})
        }
    } else if (req.query.search) {
        let sqlCount = `SELECT COUNT(*) AS COUNT FROM myproducts where name like '%${req.query.search}'`
        let sql = `SELECT * FROM myproducts where name like '%${req.query.search}%' LIMIT 6 OFFSET ${page}`;
        const query = await Promise.all( [ queryDatabase(sql), queryDatabase(sqlCount)])
            if (query[0].length !== 0) {
                return res.status(200).json(query);
            } else {
                return res.status(404).json({err: "Something went wrong."})
            }
    } else {
        let sqlCount = `SELECT COUNT(*) AS COUNT FROM myproducts`
        let sql = `SELECT * FROM myproducts ORDER BY id DESC LIMIT 6 OFFSET ${page}`
        const query = await Promise.all( [ queryDatabase(sql), queryDatabase(sqlCount)])
            if (query[0].length !== 0) {
                return res.status(200).json(query);
            } else {
                return res.status(404).json({err: "Something went wrong."})
            }
    }
    } catch (err) {
        console.log(err)
    }
})