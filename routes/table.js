const express = require('express')
const router = express.Router()
const products = require('./products')
const tableController = require('../controllers/tableController')

router.get('/', tableController.table_get)

router.post('/', tableController.table_create_post)

router.use('/products', products)

module.exports = router