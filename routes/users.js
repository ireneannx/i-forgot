const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
const { enAuthenticated } = require('../config/auth');

const SimpleCrypto = require('simple-crypto-js').default;
const _secretKey = require('../config/keys').encryptionKey;
const simpleCrypto = new SimpleCrypto(_secretKey);

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'cohortdths@gmail.com',
    pass: 'classof2019'
  }
});

// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

//test
router.get('/logins', enAuthenticated, (req, res) => {});

// Register Page
router.get('/register', (req, res) => res.render('register.ejs'));

// Register Handle
router.post('/register', (req, res) => {
  // pull variables out
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      // Same as errors: errors
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation Passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        // User exists
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // Encrypt Password
        newUser.password = simpleCrypto.encrypt(newUser.password);

        newUser
          .save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and can login');
            // Send a welcome mail
            transporter
              .sendMail({
                from: '"Irene & Co" <cohortdths@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Welcome to passLock', // Subject line
                text: 'Hello world?', // plain text body
                html: `<p>Hi ${req.body.name}, <br> Thank you for creating an account with passLock. Your passwords are safe with us. </p>` // html body
              })
              .then(info => {
                console.log('Message sent: %s', info.messageId);
              })
              .catch(() => {
                console.log('something went wrong.');
              });
            res.redirect('/users/login');
          })
          .catch(err => console.log(err));
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
