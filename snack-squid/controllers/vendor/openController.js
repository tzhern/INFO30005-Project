const Van = require('../../model/van')

// Check whether the van is open. If open, redirect to order page. If not, get to open page
const checkLocation = async(req, res) => {
    let ID = req.session.vanId;
    try {
        let thisVan = await Van.findOne({ _id: ID }, { open: true })
        if (thisVan['open'] === true) {
            return res.redirect('/vendor/order')
        } else {
            return res.render('vendor/open')
        }
    } catch (err) {
        console.log("Database query collection 'van' failed!")
        return res.redirect('/vendor')
    }
}

// Find the van by Id and change the value open as true
const openForBusiness = async(req, res) => {
    let ID = req.session.vanId;
    let location = req.body.location
    try {
        // Update the text location and set van as open
        updateLocation(ID, location, res)
        await Van.updateOne({ _id: ID }, { $set: { open: true } })
        console.log("the van is open")
        res.redirect('/vendor/order')


    } catch (err) {
        console.log("Database query collection 'van' failed!")
        return res.redirect('/vendor')
    }
}

// Update the location
const updateLocation = async(ID, vanLocation, res) => {
    try {
        // Find the van and set the location value
        await Van.updateOne({ _id: ID }, { $set: { textLocation: vanLocation } })
        return 1
    } catch (err) {
        console.log("Database query collection 'van' failed!")
        return res.redirect('/vendor')
    }
}

const updategeoLocation = async(req, res) => {
    ID = req.session.vanId
    try {
        // Set the location as its Geolocation
        //let thisVan = await Van.findOne({ _id: ID }, { open: true })
        geoLocation = req.body;
        await Van.updateOne({ _id: ID }, { $set: { location: geoLocation } })
    } catch (err) {
        console.log("Database query collection 'van' failed!")
        return res.redirect('/vendor')
    }
}

module.exports = {
    checkLocation,
    openForBusiness,
    updateLocation,
    updategeoLocation
}