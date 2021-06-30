const express = require("express")

const findVanRouter = express.Router();
const findVanController = require('../../controllers/customer/findVanController')

// render map page
findVanRouter.get('/', findVanController.renderMap);

// post a van to choose that van
findVanRouter.post('/:vanName', findVanController.chooseVan)


module.exports = findVanRouter