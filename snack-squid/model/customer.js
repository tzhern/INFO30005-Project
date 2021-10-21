const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const customerSchema = new mongoose.Schema({
    givenName: { type: String, required: true },
    familyName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

customerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
customerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
const Customer = mongoose.model("Customer", customerSchema)

module.exports = Customer