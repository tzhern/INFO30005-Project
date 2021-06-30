const express = require('express')
const registerRouter = express.Router()


const passport = require('passport');
require('../../config/passport')(passport);

const pageController = require('../../controllers/vendor/pageController')

registerRouter.get('/', pageController.renderRegisterPage)
    // vendor register
registerRouter.post('/', passport.authenticate('van-signup', {
    successRedirect: '/vendor/', // redirect to the homepage
    failureRedirect: '/vendor/register/', // redirect to signup page
    failureFlash: true // allow flash messages
}))


module.exports = registerRouter