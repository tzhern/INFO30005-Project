const express = require('express')
const openRouter = express.Router()
const openController = require('../../controllers/vendor/openController')

// van change status as open when opening-for-business
openRouter.post('/open', openController.openForBusiness)

// render open-for-business page
openRouter.get('/', openController.checkLocation)

// update latitude and longitude location of van
openRouter.post('/', openController.updategeoLocation)
module.exports = openRouter