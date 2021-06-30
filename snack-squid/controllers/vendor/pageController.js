const renderLoginPage = (req, res) => {
    let error = req.flash("loginMessage");
    res.render('vendor/login', { error: error})
}


const renderRegisterPage = (req, res) => {
    let error = req.flash("signupMessage");
    res.render('vendor/registration', { error: error})
}
module.exports = { renderLoginPage, renderRegisterPage }