'use strict';

var app = require('express')();
var path = require('path');

var session = require('express-session');
var passport = require('passport')

var User = require('../api/users/user.model')

// "Enhancing" middleware (does not send response, server-side effects only)

app.use(require('./logging.middleware'));

app.use(require('./body-parsing.middleware'));

// "Responding" middleware (may send a response back to client)


app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'tongiscool', // or whatever you like
  // these options are recommended and reduce session concurrency issues
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// don't forget to install passport-google-oauth
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
  new GoogleStrategy({
    clientID: '999185384102-pt5b1qnk96cdnf6era5mugl18dqusk59.apps.googleusercontent.com',
    clientSecret: 'n-ioF1P5Mf_K8yV26hGrdg3j',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  // Google will send back the token and profile
  function (token, refreshToken, profile, done) {
    // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
    console.log('---', 'in verification callback', profile, '---');
    User.findOrCreate({
      where: {
        googleId: profile.id
      },
      defaults: {
        name: profile.displayName,
        email: profile.emails[0].value,
      }
    })
    .spread(user => {
      done(null, user)
    })
    .catch(done)
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id)
});

app.use(function (req, res, next) {
  if(!req.session.activeTime) {
    req.session.activeTime = new Date()
  }
  else if (new Date() - req.session.activeTime > 10000) {
    req.session.userId = null
  } else {
    req.session.activeTime = new Date()
  }
  next();
});

// Google authentication and login
app.get('/auth/google', passport.authenticate('google', { scope: 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/', // or wherever
    failureRedirect: '/' // or wherever
  })
);

app.use('/login', require('./login-router'))

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

app.use(require('./error.middleware'));

module.exports = app;
