const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const userController = require('../controller/user.js')




const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { Passport } = require('passport');
const { savedRedirectUrl } = require('../middleware.js');
// router.use(express.urlencoded({ extended: true }));



router.get('/signUp', userController.signUpForm)

router.get('/login', userController.loginForm)

router.post('/signUp', wrapAsync(userController.signUp))
router.post('/login',savedRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login))

//logout user
router.get('/logout', userController.logout)

module.exports = router;

