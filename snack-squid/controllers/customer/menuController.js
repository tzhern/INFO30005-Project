const Menu = require('../../model/menu')
const Van = require('../../model/van')

// get menu
const getMenu = async(req, res) => {
    let vanName = req.params.van_name;
    try {
        const snacks = await Menu.find({ type: 'snack' }, {}).lean()
        const drinks = await Menu.find({ type: 'drink' }, {}).lean()
        const van = await Van.findOne({vanName: vanName}, {}).lean()
        // if no van, redirect to error page
        if (van.length == 0) {
            return res.redirect('/404-NOT-FOUND')
        }
            // empty menu
        if (snacks.length == 0 || drinks.length == 0) {
            console.log("no food to show in menu!")
            return res.redirect('/404-NOT-FOUND')
        }
        res.render('customer/menu', { "snacks": snacks, "drinks": drinks })
    } catch (err) {
        console.log("Database query 'menu' failed!")
        return res.redirect('/404-NOT-FOUND')
    }
}


// get food details and render the foodDetails page
const getFoodDetails = async(req, res) => {
    try {
        // find the food
        const food = await Menu.find({ tag: req.params.tag }, { foodName: true, price: true, photo: true, description: true }).lean()
            // if food does not exist
        if (food.length == 0) {
            console.log("food does not exist!")
            return res.redirect('/404-NOT-FOUND')
        }
        res.render('customer/foodDetails', { "food": food })
    } catch (err) {
        console.log("Database query 'menu' failed!")
        return res.redirect('/404-NOT-FOUND')
    }
}

module.exports = { getMenu, getFoodDetails }