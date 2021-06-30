const Order = require('../../model/order')
const Van = require('../../model/van')
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose')
const Timestamp = mongoose.model('Timestamp')

// Get outstanding orders and fulfilled orders
const getOrder = async(req, res) => {
    let vanId = req.session.vanId
    vanId = new ObjectId(vanId)
    try {
        // find van detail
        const van = await Van.findOne({ _id: vanId })
            // Find order under that customer
        const outstanding = await Order.find({ vanId: van._id, status: "preparing" }, {}).sort({ 'orderNo': -1 }).populate("customerId", "givenName-_id").lean()
        const fulfilled = await Order.find({ vanId: van._id, status: "fulfilled" }, {}).sort({ 'orderNo': 1 }).populate("customerId", "givenName-_id").lean()

        //const completed = await Order.find({ vanId: van._id, status: "completed" }, {}).populate("customerId", "givenName-_id").lean()

        //Stringify the order list
        for (let i = 0; i < outstanding.length; i++) {
            outstanding[i].details = JSON.stringify(outstanding[i].details);
        }

        for (let i = 0; i < fulfilled.length; i++) {
            fulfilled[i].details = JSON.stringify(fulfilled[i].details);
        }
        // get discount order timestamp
        const discountAwardLimit = await Timestamp.findOne({ timeLimitType: "discountAwardLimit" }, {}).lean()


        res.render('vendor/order', { "preparingOrders": outstanding, "fulfilledOrders": fulfilled, "discountTime": discountAwardLimit });
    } catch (err) {
        console.log("Database query collection 'van' failed!")
        return res.redirect('/vendor')
    }
}

// Fulfill the order 
const fulfillOrder = async(req, res) => {
    let id = req.body.orderId
        // Find the order to be fulfilled by the order id
    try {
        result = await Order.findOne({ _id: id }, {})
        if (result) {
            let now = new Date();
            let updatetime = new Date(result.updateTime);

            const discountAwardLimit = await Timestamp.findOne({ timeLimitType: "discountAwardLimit" }, {})
            let timeStamp = parseInt(discountAwardLimit.limit);

            let dist = now - updatetime;
            if ((dist / 1000) / 60 > timeStamp) {
                console.log("update discount");
                let price = parseInt(result.total) * 0.8;
                await Order.updateOne({ _id: id }, { $set: { discount: true, total: price } }, { timestamps: false })
            }

            // Set status as fulfilled
            await Order.updateOne({ _id: id }, { $set: { status: 'fulfilled' } }, { timestamps: false })
            console.log('order ' + id + ' fulfilled')
            return res.redirect('/vendor/order')
        } else {
            return res.send('no order found,please enter order id')
        }
    } catch (err) {
        console.log("Database query collection 'order' failed!")
        return res.redirect('/404-NOT-FOUND')
    }
}

// Complete the order
const completeOrder = async(req, res) => {
    let id = req.body.orderId
        // Find the order to be completed by the order id
    try {
        result = await Order.findOne({ _id: id }, {})
        if (result) {

            // Set status as complete
            await Order.updateOne({ _id: id }, { $set: { status: 'completed' } }, { timestamps: false })
            console.log('order ' + id + ' complete')
            return res.redirect('/vendor/order')

        } else {
            return res.send('no order found,please enter order id')
        }
    } catch (err) {
        console.log("Database query collection 'order' failed!")
        return res.redirect('/404-NOT-FOUND')
    }
}
module.exports = { getOrder, fulfillOrder, completeOrder }