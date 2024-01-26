const express = require('express')
const router = express.Router()
const productsController = require('../controllers/productsController')

router.get('/', productsController.product_get)

//router.get('/create', productsController.product_test)

router.post('/', productsController.product_create)

router.put('/', productsController.product_put)

router.delete('/:productid', productsController.product_delete)

module.exports = router;