const { ConsoleMessage } = require('puppeteer');
const queryDatabase = require('../querydb');

exports.table_create_post = (async (req, res, next) => {
    try {
        let sql = `CREATE TABLE myproducts(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(150), price INT DEFAULT NULL, lowest_price INT DEFAULT NULL, price_yesterday INT DEFAULT, lowest_price_date timestamp DEFAULT (current_timestamp), url TEXT, image_url VARCHAR(500) DEFAULT "https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png");`;
        let updateSql = `CREATE TABLE updates(id INT PRIMARY KEY, last_updated timestamp DEFAULT NULL)`;
        const query = await Promise.all([queryDatabase(sql), queryDatabase(updateSql)]);
        return res.status(200).json('Tables created!');
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
});

exports.table_get = ( async (req, res, next) => {
    let page = ((req.query.page - 1) * 6);
    let sqlCount = `SELECT COUNT(*) AS COUNT FROM myproducts`;
    if (req.query.update) {
        let sql = `SELECT updated_date FROM updates`;
        const query = await queryDatabase(sql);
        if (query.length !== 0) {
            return res.status(200).json(query);
        } else {
            return res.status(400).json({err: "Something went wrong."})
        }
    }  else if (req.query.search) {
        if (req.query.sort) {
            let searchCount = `SELECT COUNT(*) AS COUNT FROM myproducts WHERE name LIKE concat('%', ?)`;
            let sql = `SELECT * FROM myproducts WHERE name LIKE concat('%', ?, '%') ORDER BY ${req.query.sort} LIMIT 6 OFFSET ${page}`;
            const query = await Promise.all( [queryDatabase(sql, (`${req.query.search}`)), queryDatabase(searchCount, (`${req.query.search}`))]);
            if (query[0].length !== 0) {
                return res.status(200).json(query);
            } else {
                return res.status(404).json({err: "Something went wrong."});
            }
        } else {
            let searchCount = `SELECT COUNT(*) AS COUNT FROM myproducts WHERE name LIKE concat('%', ?)`;
            let sql = `SELECT * FROM myproducts WHERE name LIKE concat('%', ?, '%') LIMIT 6 OFFSET ${page}`;
            const query = await Promise.all( [queryDatabase(sql, (`${req.query.search}`)), queryDatabase(searchCount, (`${req.query.search}`))]);
            if (query[0].length !== 0) {
                return res.status(200).json(query);
            } else {
                return res.status(404).json({err: "Something went wrong."});
            }
        }
        } else if (req.query.sort) {
            let sql = `SELECT * FROM myproducts ORDER BY ${req.query.sort} LIMIT 6 OFFSET ${page}`;
            const query = await Promise.all([queryDatabase(sql), queryDatabase(sqlCount)]);
            if (query[0].length !== 0) {
                return res.status(200).json(query);
            } else {
                return res.status(404).json({err: "Something went wrong."});
            }
        } else {
            let sql = `SELECT * FROM myproducts ORDER BY id DESC LIMIT 6 OFFSET ${page}`;
            const query = await Promise.all([queryDatabase(sql), queryDatabase(sqlCount)]);
            if (query[0].length !== 0) {
                return res.status(200).json(query);
            } else {
                return res.status(404).json({err: "Something went wrong."});
            }
        }
    });

exports.table_post = (async ( req, res, next )=> {
    try {
        let sql = `INSERT INTO updates (id) VALUES(1)`;
        const query = await queryDatabase(sql);
        return res.status(200).json({success: true});
    } catch (err) {
        console.log(err);
    }
});
