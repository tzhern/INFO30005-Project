const express = require("express")
const utilities = require("./utility");
const profileRouter = express.Router()
const customerController = require("../../controllers/customer/customerController")

// render to profile page
profileRouter.get('', utilities.isLoggedIn, (req, res) => customerController.renderProfilePage(req, res,1))

// user logout 
profileRouter.post('/logout', customerController.logout)

// user update profile
profileRouter.post('/update/:customerid', customerController.updateProfile)

// handle get request to render edit profile page
profileRouter.get('/update/:customerid', (req,res)=>customerController.renderProfilePage(req, res, 0))

module.exports = profileRouter