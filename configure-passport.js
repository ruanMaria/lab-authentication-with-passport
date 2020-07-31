'use strict';

// Passport Strategy configuration
const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcryptjs');

const LocalStrategy = passportLocal.Strategy;

const User = require('./models/user');

//2. Configure the serialization and deserialization process

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((error) => {
      callback(error);
    });
});

//3. Configure passport strategies for sign-up and sign-in

passport.use(
  'sign-up',
  new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },
   (req, email, password, callback) => {
      const username = req.body.username;
      const role = req.body.role;

    bcrypt
      .hash(password, 10)
      .then((hashAndSalt) => {
        return User.create({
          username,
          email,
          role,
          passwordHash: hashAndSalt,
        });
      })
      .then((user) => {
        callback(null, user);
      })
      .catch((error) => {
        callback(error);
      });
  })
);

passport.use(
  'sign-in',
  new LocalStrategy({}, (username, password, callback) => {
    let user;
    User.findOne({
      username,
    })
      .then((document) => {
        user = document;
        return bcrypt.compare(password, user.passwordHash);
      })
      .then((result) => {
        if (result) {
          callback(null, user);
        } else {
          return Promise.reject(new Error('The password is incorrect'));
        }
      })
      .catch((error) => {
        callback(error);
      });
  })
);
