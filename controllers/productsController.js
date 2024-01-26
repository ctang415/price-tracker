const db = require('../connection');
const asyncHandler = require('express-async-handler');
const puppeteer = require('puppeteer');
const queryDatabase = require('../querydb')

exports.product_get = asyncHandler ( async (req, res, next) => {

    if (req.query.url !== undefined) {
    let sql = `SELECT * FROM myproducts WHERE url LIKE '%${req.query.url}%'`;
   
    const query = await queryDatabase(sql);
    if (query.length === 0) {
        return res.status(200).json({success: false})
    } else {
        return res.status(400).json({msg: "This product is already being tracked."})
    }
    } else {
        let page = ((req.query.page - 1) * 6);
        let sql = `SELECT * FROM myproducts WHERE name LIKE '%${req.query.search}%' ORDER BY id DESC LIMIT 6 OFFSET ${page}`;
        let sqlCount = `SELECT COUNT(*) AS COUNT FROM myproducts where name like '%${req.query.search}%'`
        
        const query = await Promise.all( [ queryDatabase(sql), queryDatabase(sqlCount)])

        if (query.length !== 0) {
            return res.status(200).json(query)
        } else {
            return res.status(400).json({msg: "Item not found."})
        }   
    }

})

exports.product_create = asyncHandler( async (req, res, next) => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    await page.goto(req.body.link, {
        waitUntil: "domcontentloaded",
      });
    await page.waitForSelector('h1')
    await page.waitForSelector('img');
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
     
    const item = await page.evaluate(() => {
        const name = [...document.querySelectorAll('title, h1')].map(elem => elem.innerText).filter(el => el).map(elem => elem.replaceAll('\n', '').trim());
        const price = [...document.querySelectorAll(
        'span[data-testid*="price"], span[class*="price"]:not(footer), span[class*="Price"]:not(footer), div[class*="Price"]:not(footer), div[class*="price"]:not(footer)'
        )].map(el => el.innerText.includes('$') ? parseInt(el.innerText.replace('$', '')) : parseInt(el.innerText)).filter(el => el).filter( (el, index, arr) => arr.indexOf(el) === index).slice(0,2).sort((a, b) => {return a - b })
        const image = [...document.querySelectorAll(`img[alt*="${name[0].slice(name[0].length/2, (name[0].length/2) + 10)}"]`)].map(elem => elem.getAttribute('src'));
        if (image.length === 0) {
            const image = [...document.querySelectorAll('div[class*="product"] > img')].map(elem => elem.getAttribute('src'))
            if (image.length === 0) {
                const image = [...document.querySelectorAll(`picture > img[loading="eager"]`)].map(elem => elem.getAttribute('src'))
                    return { name, price, image }       
            }
                return { name, price, image}
        } else {
            return {name, price, image}
        }
     })
     console.log(item)

     if (item.name[0] !== undefined) {
        if (item.price[0] == undefined && item.image[0] == undefined) {
            let insertSql = `INSERT INTO myproducts (name, url) 
            VALUES ("${item.name[0]}", "${req.body.link}")`
            const query = await queryDatabase(insertSql);

            if (query.length !== 0) {
                res.status(200).json({msg: 'Product successfully added!'});
                return await browser.close()
            } else {
                res.status(404).json({err: "Product could not be added."});
                return await browser.close()
            }
        } else if (item.price[0] == undefined) {
            let insertSql = `INSERT INTO myproducts (name, url, image_url) 
            VALUES ("${item.name[0]}", "${req.body.link}", "${item.url[0]}")`
            const query = await queryDatabase(insertSql);

            if (query.length !== 0) {
                res.status(200).json({msg: 'Product successfully added!'});
                return await browser.close();
            } else {
                res.status(404).json({err: "Product could not be added."});
                return await browser.close();
            }
        } else if (item.image[0] == undefined) {
            let insertSql = `INSERT INTO myproducts (name, price, lowest_price, url) 
            VALUES ("${item.name[0]}", ${item.price[0]}, ${item.price[0]}, "${req.body.link}")`
            const query = await queryDatabase(insertSql);

            if (query.length !== 0) {
                res.status(200).json({msg: 'Product successfully added!'});
                return await browser.close();
            } else {
                res.status(404).json({err: "Product could not be added."});
                return await browser.close();
            }
        } else {
            let insertSql = `INSERT INTO myproducts (name, price, lowest_price, url, image_url) 
            VALUES ("${item.name[0]}", ${item.price[0]}, ${item.price[0]}, "${req.body.link}", "${item.image[0]}")`

            const query = await queryDatabase(insertSql);

            if (query.length !== 0) {
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

})

exports.product_test = asyncHandler( async (req, res, next) => {
    //let sql = "INSERT INTO myproducts (name, price, lowest_price, url, image_url) VALUES ('HIKING STICKS', 55, 55, 'https://www.amazon.com/gp/product/B07DYKZD7X?th=1', 'https://m.media-amazon.com/images/I/6134PIDPt0L._AC_SL1200_.jpg')"
    let sql = "INSERT INTO myproducts (name, price, lowest_price, url, image_url) VALUES ('REEBOK CLUB C SNEAKERS', 60, 60, 'https://www.pacsun.com/reebok/womens-cream-club-c-85-vintage-sneakers-0705244.html?store=&country=US&currency=USD&OriginId=GOG&XCIDP=P%3AG_Shopping_PMAX_W_Shoes&gad_source=4&gclid=CjwKCAiAqY6tBhAtEiwAHeRopVHblvOqw2i0c7tTkzmscslNjP-n8XNpY-2F64f5YEq_GC0ZtF-udhoCr9YQAvD_BwE&gclsrc=aw.ds', 'https://www.pacsun.com/dw/image/v2/AAJE_PRD/on/demandware.static/-/Sites-pacsun_storefront_catalog/default/dwba8970fc/product_images/0542491370018NEW_01_569.jpg?sw=3000')"
    
    const query = await queryDatabase(sql);

    if (query.length !== 0) {
        return console.log(query)
    } else {
        return console.log('no')
    }
})


exports.product_put = asyncHandler ( async (req, res, next) => {

    let sql = `SELECT id, price, lowest_price, url FROM myproducts`
    const listOfProducts = await queryDatabase(sql);

    const browser = await puppeteer.launch( {header: false});
    const page = await browser.newPage();
    
    for (let x = 0; x < listOfProducts.length; x++) {
        await page.goto(listOfProducts[x].url, {
            waitUntil: "domcontentloaded"
        })

    await page.waitForSelector('img');
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
     
    const item = await page.evaluate(() => {
       const price = [...document.querySelectorAll(
        'span[data-testid*="price"], span[class*="price"]:not(footer), span[class*="Price"]:not(footer), div[class*="Price"]:not(footer), div[class*="price"]:not(footer)'
        )].map(el => el.innerText.includes('$') ? parseInt(el.innerText.replace('$', '')) : parseInt(el.innerText)).filter(el => el).filter( (el, index, arr) => arr.indexOf(el) === index).slice(0,2).sort((a, b) => {return a - b })
        
        return { price }
    })

    if (item.price < listOfProducts[x].lowest_price) {
        let updateSql = `UPDATE myproducts
        SET price = ${item.price[0]},
        lowest_price = ${item.price[0]}, 
        lowest_price_date = CURRENT_DATE
        WHERE url = ${listOfProducts.url[x]}`;
        const query = await queryDatabase(updateSql);
        if (query.length !== 0) {
            return res.status(200).json(query)
        }  else {
            return res.status(404).json({err: "Product could not be updated."})
        }
    } else {
        let sql = `UPDATE myproducts
        SET price = ${item.price[0]}
        WHERE url = ${listOfProducts.url[x]}`;
        const query = await queryDatabase(sql);
        if (query.length !== 0) {
            return res.status(200).json(query)
        }  else {
            return res.status(404).json({err: "Product could not be updated."})
        }
    }
}
    await browser.close();

})

exports.product_delete = asyncHandler( async (req, res, next) => {
    let sql = `DELETE FROM myproducts where id = ${req.params.productid}`
    
    const query = await queryDatabase(sql);

    if (query.length !== 0) {
        return res.status(200).json({msg: 'Product successfully removed!'})
    } else {
        return res.status(404).json({err: "Product could not be removed."});
    }
})