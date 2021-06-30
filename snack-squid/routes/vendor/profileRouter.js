const express = require('express')
const profileRouter = express.Router()
const utilities = require("./utility");
const profileController = require('../../controllers/vendor/profileController')

// log out
profileRouter.get('/logout', profileController.logout)

// change location description
profileRouter.post('/change', profileController.changetextLocation)

// close the van
profileRouter.get('/close', profileController.close)

// render profile page
profileRouter.get('/', profileController.renderProfile)

// change latitude and longtitude location
profileRouter.post('/', profileController.changeLocation)
module.exports = profileRouter