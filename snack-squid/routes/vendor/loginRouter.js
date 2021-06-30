const express = require('express')
const loginRouter = express.Router()

const passport = require('passport');
require('../../config/passport')(passport);

const pageController = require('../../controllers/vendor/pageController')
loginRouter.get('/', pageController.renderLoginPage)
    // vendor login 
loginRouter.post('/', passport.authenticate('van-login', {
    successRedirect: '/vendor/open-for-business/',
    failureRedirect: '/vendor/', // redirect back to the login page if there is an error
    failureFlash: true // allow flash messages
}));

module.exports = loginRouter