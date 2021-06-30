const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    _id: false,
    foodName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
})

const feedbackSchema = new mongoose.Schema({
    _id: false,
    ratings: { type: Number, min: 1, max: 5 },
    comment: { type: String }
})

const orderSchema = new mongoose.Schema({
    orderNo: { type: Number, required: true },
    customerId: { type: mongoose.Types.ObjectId, required: true, ref: "Customer" },
    vanId: { type: mongoose.Types.ObjectId, required: true, ref: "Van" },
    status: { type: String, enum: ["preparing", "fulfilled", "cancelled", "completed"] },
    details: { type: [cartSchema], required: true },
    total: { type: Number },
    discount: { type: Boolean, default: false, required: false },
    feedback: { type: feedbackSchema },
}, { timestamps: { createdAt: 'orderTime', updatedAt: 'updateTime' } })

const timestampSchema = new mongoose.Schema({
    timeLimitType: { type: String, enum: ["alterOrderLimit", "discountAwardLimit"] },
    limit: { type: Number }
})

const Order = mongoose.model('Order', orderSchema)
const Cart = mongoose.model('Cart', cartSchema)
const Timestamp = mongoose.model('Timestamp', timestampSchema)

module.exports = Order, Cart, Timestamp