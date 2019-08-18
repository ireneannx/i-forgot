const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const SimpleCrypto = require('simple-crypto-js').default;
const _secretKey = require('./keys').encryptionKey;
const simpleCrypto = new SimpleCrypto(_secretKey);

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: 'This email is not registered'
            });
          }
          
          // Match password
          if (password == simpleCrypto.decrypt(user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
