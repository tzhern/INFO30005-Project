const express = require("express")
const utilities = require("./utility");
const menuController = require('../../controllers/customer/menuController')
const orderController = require('../../controllers/customer/orderController')

const menuRouter = express.Router()

// show menu page
menuRouter.get('/van=:van_name', menuController.getMenu)

// get details of food
menuRouter.get('/van=:van_name/:tag', menuController.getFoodDetails)

// place order
menuRouter.post('/van=:van_name/place-order',
    utilities.isLoggedIn, (req, res) => orderController.placeOrder(req, res))

module.exports = menuRouter