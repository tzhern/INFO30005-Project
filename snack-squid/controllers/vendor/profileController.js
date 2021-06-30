const Van = require('../../model/van')

// van logout
const logout = async(req, res) => {
    req.logout()
    console.log('logout successfully')
    return res.redirect('/vendor/')
}

// Close the van and set the text location and geolocation to be empty
const close = async(req, res) => {
    let ID = req.session.vanId;
    try {
        geolocation = {
            'latitude': 0.0,
            'longitude': 0.0
        }
        await Van.updateOne({ _id: ID }, { $set: { textLocation: "", open: false, location: geolocation } })
        console.log("van " + ID + " logout")
        req.logout()
        return res.redirect('/vendor/')
    } catch (err) {
        console.log("Database query collection 'menu' failed!")
        return res.redirect('/404-NOT-FOUND')
    }
}

// Change the description location
const changetextLocation = async(req, res) => {
    let ID = req.session.vanId;
    let newLocation = req.body.newLocation
    try {
        await Van.updateOne({ _id: ID }, { $set: { textLocation: newLocation, open: true } })
        console.log('change to ' + newLocation)
        res.redirect('/vendor/order')
    } catch (err) {
        console.log("Database query collection 'van' failed!")
        return res.redirect('/404-NOT-FOUND')
    }
}

// Render the profile page and send its description locaiton to the page
const renderProfile = async(req, res) => {
    try {
        let ID = req.session.vanId;
        let thisVan = await Van.findOne({ _id: ID }, { textLocation: true }).lean();
        res.render('vendor/profile', { 'Van': thisVan })
    } catch (err) {
        console.log("Database query collection 'van' failed!")
        return res.redirect('/vendor/login')
    }
}

// Change its geolocation
const changeLocation = async(req, res) => {
    ID = req.session.vanId
    try {
        geoLocation = req.body;
        await Van.updateOne({ _id: ID }, { $set: { location: geoLocation } })
    } catch (err) {
        console.log("Database query collection 'van' failed!")
        return res.redirect('/404-NOT-FOUND')
    }

}
module.exports = { logout, close, changetextLocation, renderProfile, changeLocation }