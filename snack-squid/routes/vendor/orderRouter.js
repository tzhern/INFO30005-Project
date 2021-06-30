const express = require('express')
const orderRouter = express.Router()
const orderController = require('../../controllers/vendor/orderController')


// render order page
orderRouter.get('/', orderController.getOrder)

// fulfill the order
orderRouter.post('/fulfill-order', orderController.fulfillOrder)

// complete the order
orderRouter.post('/complete-order', orderController.completeOrder)
module.exports = orderRouter