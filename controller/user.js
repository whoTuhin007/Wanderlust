






const User = require('../models/user.js');



module.exports.signUpForm = (req, res) => {


    res.render('signUp.ejs')

}

module.exports.signUp  = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        
        const newUser = new User({ username, email });



        let registeredUser = await User.register(newUser, password)
       

        // Automatically log in the user after signup
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash('error', 'Something went wrong during login.');
                return res.redirect('/login');
            }
            req.flash('success', 'Welcome to Wanderlust');
            res.redirect('/listing')

        })

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/signUp')
    }

} ;



module.exports.loginForm = (req, res) => {
    res.render('login.ejs')



}


module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back to Wanderlust!')
    let redirectedUrl= res.locals.redirectUrl || 'listing';

    res.redirect(redirectedUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err)


        }
        req.flash('success', 'You are logged out')
        res.redirect('/listing')
    })


}