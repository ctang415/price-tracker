const puppeteer = require('puppeteer');
const queryDatabase = require('../querydb');
const sendEmail = require('../mail');

exports.product_get =  ( async (req, res, next) => {
    if (req.query.url !== undefined) {
        // checks the add input to see if a url for the product already exists in the database
        let sql = `SELECT * FROM myproducts WHERE url LIKE concat("%", ?, "%")`;
        const query = await queryDatabase(sql, (`${req.query.url}`));
        if (query.length === 0) {
            return res.status(200).json({success: false});
        } else {
            return res.status(400).json({msg: "This product is already being tracked."});
        }
    } else {
        // checks the search input to see if product exists in database
        let page = ((req.query.page - 1) * 6);
        let sql = `SELECT * FROM myproducts WHERE name LIKE concat("%", ?, "%") ORDER BY id DESC LIMIT 6 OFFSET ${page}`;
        let sqlCount = `SELECT COUNT(*) AS COUNT FROM myproducts WHERE name LIKE concat('%', ?, '%')`;
        const query = await Promise.all( [ queryDatabase(sql, (`${req.query.search}`)), queryDatabase(sqlCount, `${req.query.search}`)]);
        if (query.length !== 0) {
            return res.status(200).json(query);
        } else {
            return res.status(400).json({msg: "Item not found."});
        }
    }
});

exports.product_create = ( async (req, res, next) => {
    // creates new database entry for product
    try {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
        await page.setUserAgent(userAgent);
        await page.goto(req.body.link, {waitUntil: "domcontentloaded", });
        await page.waitForSelector('img');
    
        const item = await page.evaluate(() => {
            const name = [...document.querySelectorAll('title, h1')].map(elem => elem.innerText).filter(el => el).map(elem => elem.replaceAll('\n', '').trim());
            const price = [...document.querySelectorAll('span[data-testid*="price"], span[class*="price"]:not(footer), span[class*="Price"]:not(footer), div[class*="Price"]:not(footer), div[class*="price"]:not(footer)')].map(el => el.innerText.includes('$') ? parseInt(el.innerText.replace('$', '')) : parseInt(el.innerText)).filter(el => el).filter( (el, index, arr) => arr.indexOf(el) === index).slice(0,2).sort((a, b) => {return a - b });
            let image;
            image = [...document.querySelectorAll(`img[alt*="${name[0].split('')[0]}"]`)].map(elem => elem.getAttribute('src')).filter(el => el);
            if (image.length === 0) {
                image = [...document.querySelectorAll('div[class*="product"] > img')].map(elem => elem.getAttribute('src')).filter(el => el);
                if (image.length === 0) {
                    image = [...document.querySelectorAll(`picture > img[loading="eager"]`)].map(elem => elem.getAttribute('src')).filter(el => el);
                    return { name, price, image }
                }
                return { name, price, image}
            } 
            return {name, price, image}
        })
        console.log(item);

        if (item.name[0] !== undefined) {
            if (item.price[0] == undefined && item.image[0] == undefined) {
                //let insertSql = `INSERT INTO myproducts (name, url) VALUES ("${item.name[0]}", "${req.body.link}")`;
                let insertSql = `INSERT INTO myproducts (name, url) VALUES ("${item.name[0]}", ?)`;
                const query = await queryDatabase(insertSql, (`${req.body.link}`));
                if (query.affectedRows !== 0) {
                    res.status(200).json({msg: 'Product successfully added!'});
                    return await browser.close();
                } else {
                    res.status(404).json({err: "Product could not be added."});
                    return await browser.close();
                }
            } else if (item.price[0] == undefined) {
                let insertSql = `INSERT INTO myproducts (name, url, image_url) VALUES ("${item.name[0]}", ?, "${item.url[0]}")`;
                const query = await queryDatabase(insertSql, (`${req.body.link}`));
                if (query.affectedRows !== 0) {
                    res.status(200).json({msg: 'Product successfully added!'});
                    return await browser.close();
                } else {
                    res.status(404).json({err: "Product could not be added."});
                    return await browser.close();
                }
            } else if (item.image[0] == undefined) {
                let insertSql = `INSERT INTO myproducts (name, price, lowest_price, url) VALUES ("${item.name[0]}", ${item.price[0]}, ${item.price[0]}, ?)`;
                const query = await queryDatabase(insertSql, (`${req.body.link}`));
                if (query.affectedRows !== 0) {
                    res.status(200).json({msg: 'Product successfully added!'});
                    return await browser.close();
                } else {
                    res.status(404).json({err: "Product could not be added."});
                    return await browser.close();
                }
            } else {
                let insertSql = `INSERT INTO myproducts (name, price, lowest_price, url, image_url) VALUES ("${item.name[0]}", ${item.price[0]}, ${item.price[0]}, ?, "${item.image[0]}")`
                const query = await queryDatabase(insertSql, (`${req.body.link}`));
                if (query.affectedRows !== 0) {
                    res.status(200).json({msg: 'Product successfully added!'});
                    return await browser.close();
                } else {
                    res.status(404).json({err: "Product could not be added."});
                    return await browser.close();
                }
            }
        } else {
            res.status(400).json({err: "Product could not be added."});
            return await browser.close();
        }
    } catch (err) {
        console.log(err);
    }
});

exports.product_put = ( async (req, res, next) => {
    // updates database entries with lowest and current prices
    let updatedItems = [];
    let sql = `SELECT id, price, lowest_price, url FROM myproducts`;
    const listOfProducts = await queryDatabase(sql);
    let priceYesterday = `UPDATE myproducts SET myproducts.price_yesterday = myproducts.price;`;
    let emailData = `SELECT email FROM updates;`;
    await queryDatabase(priceYesterday);
    for (let x = 0; x < listOfProducts.length; x++) {
        try {
            const browser = await puppeteer.launch({headless: 'new'});
            const page = await browser.newPage();
            const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
            await page.setUserAgent(userAgent);
            await page.goto(listOfProducts[x].url, {waitUntil: "domcontentloaded"});
            await page.waitForSelector('img');
            const item = await page.evaluate(() => {
                const price = [...document.querySelectorAll('span[data-testid*="price"], span[class*="price"]:not(footer), span[class*="Price"]:not(footer), div[class*="Price"]:not(footer), div[class*="price"]:not(footer)')].map(el => el.innerText.includes('$') ? parseInt(el.innerText.replace('$', '')) : parseInt(el.innerText)).filter(el => el).filter( (el, index, arr) => arr.indexOf(el) === index).slice(0,2).sort((a, b) => {return a - b });
                return { price }
            });
            console.log(item);
            if (item.price[0] < listOfProducts[x].lowest_price) {
                let updateSql = `UPDATE myproducts SET price = ${item.price[0]}, lowest_price = ${item.price[0]}, lowest_price_date = CURRENT_DATE WHERE url = "${listOfProducts[x].url}"`;                   
                const query = await queryDatabase(updateSql);
                updatedItems.push({"name":`${listOfProducts[x].name}`, "price": `${listOfProducts[x].price}`, "changed_price": `${item.price[0]}`, "image": `${listOfProducts[x].image}`, "url": `${listOfProducts[x].url}`})
            } else if (item.price[0]) {
                let sql = `UPDATE myproducts SET price = ${item.price[0]} WHERE url = "${listOfProducts[x].url}"`;
                const query = await queryDatabase(sql);
            }
            await browser.close();
        } catch (err) {
            console.log(err);
        }
    }
    let sqlUpdate = `UPDATE updates SET updated_date = CURRENT_TIMESTAMP where id = 1`;
    const query = await Promise.all([queryDatabase(sqlUpdate), queryDatabase(emailData)])
    if (query[1][0].email && updatedItems.length !== 0) {
        await sendEmail(query[1][0].email, updatedItems);
    }
    return res.status(200);
});



exports.product_delete = ( async (req, res, next) => {
    // deletes products from database
    let sql = `DELETE FROM myproducts WHERE id = ?`;
    const query = await queryDatabase(sql, (`${req.params.productid}`));
    if (query.affectedRows !== 0) {
        return res.status(200).json({msg: 'Product successfully removed!'});
    } else {
        return res.status(404).json({err: "Product could not be removed."});
    }
});