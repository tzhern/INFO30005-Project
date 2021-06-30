const Van = require('../../model/van')

// render map page
const renderMap = async(req, res) => {
    try {
        const openVans = await Van.find({ open: true }, { vanName: true, location: true, textLocation: true }).lean()
        for (let i = 0; i < openVans.length; i++) {
            openVans[i]['location'] = JSON.stringify(openVans[i]['location'])
        }
        res.render('customer/map', { 'Vans': openVans });
    } catch (err) {
        console.log("Database query collection 'menu' failed!")
        return res.redirect('/404-NOT-FOUND')
    }
}

// used to choose van
const chooseVan = (req, res) => {
    let vanName = req.body.vanName
    console.log('choosing van:', vanName)
    return res.redirect('/customer/menu/van=' + vanName)
}


module.exports = { renderMap, chooseVan }