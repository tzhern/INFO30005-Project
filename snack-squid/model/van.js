const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

// Van model
const vanSchema = new mongoose.Schema({
    vanName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailAddress: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    textLocation: { type: String },
    open: Boolean,
})

vanSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
vanSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
const Van = mongoose.model('Van', vanSchema)
module.exports = Van