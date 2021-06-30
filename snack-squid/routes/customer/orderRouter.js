const express = require("express")
const utilities = require("./utility")
const orderRouter = express.Router()
const orderController = require("../../controllers/customer/orderController")

// show all orders for the customer
orderRouter.get('',
    utilities.isLoggedIn,
    (req, res) =>
        orderController.getOrder(req, res))

// render to menu page if change order
orderRouter.post('/change/orderId=:orderId',
    utilities.isLoggedIn,
    (req, res) =>
    orderController.renderChangeOrderPage(req,res))

// replace the change order
orderRouter.post('/change/orderId=:orderId/change-order',
    utilities.isLoggedIn,
    (req, res) =>
        orderController.changeOrder(req,res))

// update cancel order 
orderRouter.post('/cancel/orderId=:orderId',
    utilities.isLoggedIn,
    (req, res) =>
        orderController.cancelOrder(req,res))


module.exports = orderRouter