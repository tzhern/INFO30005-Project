const mongoose = require("mongoose")

// Menu model
const menuSchema = new mongoose.Schema({
    foodName: { type: String, require: true },
    tag: { type: String, unique: true },
    price: { type: Number, require: true },
    photo: String,
    type: String,
    description: String
})

const Menu = mongoose.model('Menu', menuSchema)
module.exports = Menu