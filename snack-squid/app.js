const express = require('express')
const path = require('path')
const db = require('./db')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

// router for Customer app
const profileRouterCT = require('./routes/customer/profileRouter')
const menuRouterCT = require('./routes/customer/menuRouter')
const loginRouterCT = require('./routes/customer/loginRouter')
const signupRouterCT = require('./routes/customer/signupRouter')
const orderRouterCT = require('./routes/customer/orderRouter')
const findVanRouterCT = require('./routes/customer/findVanRouter')
    // router for Vendor app
const openRouterVD = require('./routes/vendor/openRouter')
const orderRouterVD = require('./routes/vendor/orderRouter')
const registerRouterVD = require('./routes/vendor/registerRouter')
const loginRouterVD = require('./routes/vendor/loginRouter')
const profileRouterVD = require('./routes/vendor/profileRouter')
    // express configuration
const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })) // replaces body-parser
app.use(express.static('public'))

app.engine('hbs', exphbs({
    defaultlayout: 'main',
    extname: 'hbs',
    helpers: require(__dirname + "/public/customer/js/helper.js").helpers
}))

app.set('view engine', 'hbs')

// passport session
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash-plus')

var helpers = require('handlebars-helpers')();

// const jwt = require('jsonwebtoken')
// const dotenv = require('dotenv').config()


app.use(cors({
    credentals: true,
    origin: "http://localhost:3000"
}))

app.use(session({
    secret: "a secret",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())

app.use(passport.session())

app.use(flash())

//mapquest API
const mq = require('mapquest')
const { profileRouter } = require('./routes/vendor/profileRouter')


// Customer app
app.get('/customer', (req, res) => {
    res.render('customer/homepage')
})

app.use('/customer/profile', profileRouterCT)

app.use('/customer/order', orderRouterCT)

app.use('/customer/signup', signupRouterCT)

app.use('/customer/login', loginRouterCT)

app.use('/customer/menu', menuRouterCT)

app.use('/customer/order', orderRouterCT)

app.use('/customer/choose-van', findVanRouterCT);
// Vendor app


app.use('/vendor/open-for-business', openRouterVD)

app.use('/vendor', loginRouterVD)

app.use('/vendor/order', orderRouterVD)
    // routers in register
app.use('/vendor/register', registerRouterVD)

app.use('/vendor/profile', profileRouterVD)

// app.get('/404-NOT-FOUND', (req, res) => {
//     res.render(path.join(__dirname + '/views/404NotFound'))
// })

// app.all('*', (req, res) => {
//     // 'default' route to catch user errors
//     res.status(404)
//     res.redirect('/404-NOT-FOUND')
// })

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})

module.exports = app;