const ObjectId = require('mongoose').Types.ObjectId;
const Customer = require("../../model/customer")
const Order = require("../../model/order")
const Menu = require("../../model/menu")
const Van = require("../../model/van")
const mongoose = require('mongoose')
const Timestamp = mongoose.model('Timestamp')

// params: [{food_id}, {quantity}]
const placeOrder = async(req, res) => {
    let cart = req.body;
    // get food price and calculate the total price
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        // get the food price
        let foodName = cart[i]["foodName"]
        try {
            let foodDetails = await Menu.findOne({ foodName: foodName }, { foodName: true, price: true })
            // update cart details
            cart[i]["foodName"] = foodDetails.foodName
            cart[i]["price"] = foodDetails.price
        } catch (err) {
            console.log("Database query collection 'menu' failed!")
            return res.redirect('/404-NOT-FOUND')
        }
        totalPrice += cart[i]["price"] * cart[i]["quantity"]
    }

    let customerId = req.session.userId
    let vanName = req.params.van_name

    // get customer details
    try {
        let customerDetail = await Customer.findOne({ _id: customerId }, { _id: true })
        if (customerDetail) {
            //pass
        } else {
            console.log("no such customer: ", customerId)
            return res.redirect('/404-NOT-FOUND')
        }
    } catch (err) {
        console.log("Database query collection 'customers' failed!")
        return res.send("Database query collection 'customers' failed!")
    }

    // get van details
    let vanId
    try {
        let vanDetails = await Van.findOne({ vanName: vanName }, { _id: true })
        if (vanDetails) {
            vanId = vanDetails._id
        } else {
            console.log("no such van: ", vanName)
            return res.redirect('/404-NOT-FOUND')
        }
    } catch (err) {
        console.log("Database query collection 'vans' failed!")
        return res.send("Database query collection 'vans' failed!")
    }

    let orderNumber = await Order.countDocuments({}) + 1;

    // new order created
    const newOrder = new Order({
        orderNo: orderNumber,
        vanId: vanId,
        customerId: customerId,
        details: cart,
        total: totalPrice,
        status: "preparing"
    })

    // push order to database
    await newOrder.save((err, result) => {
        if (err) {
            console.log("failed to save order to the database!")
            return res.redirect('/404-NOT-FOUND')
        }
        console.log("order", newOrder._id, "sent successfully!")
        return res.redirect('/customer/order')
    })
}


// get all outstanding, fulfilled and completed orders
const getOrder = async(req, res) => {
    let userId = req.session.userId
    userId = new ObjectId(userId)
    try {
        // find customer detail
        const customer = await Customer.findOne({ _id: userId })
            // find order under that customer
        const outstandingOrders = await Order.find({ customerId: customer._id, status: "preparing" }, {}).sort({ '_id': -1 }).populate("vanId", "vanName-_id").lean()
        const fulfilledOrders = await Order.find({ customerId: customer._id, status: "fulfilled" }, {}).sort({ '_id': -1 }).populate("vanId", "vanName-_id").lean()
        const completedOrders = await Order.find({ customerId: customer._id, status: "completed" }, {}).sort({ '_id': -1 }).populate("vanId", "vanName-_id").lean()
        // stringfy food details in each order
        for (let i = 0; i < outstandingOrders.length; i++) {
            outstandingOrders[i].details = JSON.stringify(outstandingOrders[i].details);
        }

        for (let i = 0; i < fulfilledOrders.length; i++) {
            fulfilledOrders[i].details = JSON.stringify(fulfilledOrders[i].details);
        }
        for (let i = 0; i < completedOrders.length; i++) {
            completedOrders[i].details = JSON.stringify(completedOrders[i].details);
        }

        // get the timestamp 
        const alterOrderLimit = await Timestamp.findOne({ timeLimitType: "alterOrderLimit" }, {}).lean()
        const discountAwardLimit = await Timestamp.findOne({ timeLimitType: "discountAwardLimit" }, {}).lean()
        alterOrderLimit.limit = JSON.stringify(alterOrderLimit.limit)
        res.render('customer/showOrder', { "preparingOrders": outstandingOrders, "fulfilledOrders": fulfilledOrders, "completedOrders": completedOrders, "alterTime": alterOrderLimit, "discountTime": discountAwardLimit });
    } catch (err) {
        console.log(err)
        return res.redirect('/404-NOT-FOUND')
    }
}

// cancel order
const cancelOrder = async(req, res) => {
    let orderId = req.params.orderId
    if (orderId === undefined || orderId === null) {
        return res.send("no order found")
    }
    try {
        let result = await Order.findOne({ _id: orderId }, {})

        // update order status
        await Order.updateOne({ _id: orderId }, { $set: { status: 'cancelled' } }, { timestamps: false })
        console.log("cancel order", orderId, "successfully!")
        return res.redirect('/customer/order')

    } catch (err) {
        return res.status(400).send('Database query failed')
    }
}

// function to change order food
const changeOrder = async(req, res) => {
    let cart = req.body;
    // get food price and calculate the total price
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        
        let foodName = cart[i]["foodName"]
        try {
            let foodDetails = await Menu.findOne({ foodName: foodName }, { foodName: true, price: true })
            // update cart details 
            cart[i]["foodName"] = foodDetails.foodName
            cart[i]["price"] = foodDetails.price
        } catch (err) {
            console.log("Database query collection 'menu' failed!")
            return res.redirect('/404-NOT-FOUND')
        }
        totalPrice += cart[i]["price"] * cart[i]["quantity"]
    }

    // get changing order id
    let orderId = req.params.orderId
    if (orderId) {
        let result = await Order.findOne({ _id: orderId }, {})
        if (result === null || result === undefined) {
            return res.send("no order found")
        }

        const orderChanged = { details: cart, total: totalPrice }
        // udpate order
        await Order.findOneAndUpdate({ _id: orderId }, orderChanged, { new: true });
        console.log("order", orderId, "updated successfully!")
        return res.redirect('/customer/order')

    }
}

// render change order page
const renderChangeOrderPage = async(req, res) => {
    let orderId = req.params.orderId
        
    if (orderId === undefined || orderId === null) {
        return res.send("no order found")
    }
    try {
        // get all menus
        const order = await Order.findOne({ _id: orderId }, { details: true }).lean()
        const snacks = await Menu.find({ type: 'snack' }, {}).lean()
        const drinks = await Menu.find({ type: 'drink' }, {}).lean()
        order.details = JSON.stringify(order.details);
        console.log("changing order:", orderId)
        return res.render('customer/changeOrder.hbs', { "snacks": snacks, "drinks": drinks, "order": order })

    } catch (err) {
        return res.status(400).send("Database query 'Order' failed")
    }
}


module.exports = { placeOrder, getOrder, changeOrder, cancelOrder, renderChangeOrderPage }