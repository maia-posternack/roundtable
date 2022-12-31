// all required stuff
const express = require('express'),
router = express.Router();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const KEYS = require('../config/keys.json');

//creates a "session"
router.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000 //600 seconds of login time before being logged out
  },
  secret: KEYS["session-secret"]
}));
router.use(passport.initialize());
router.use(passport.session());

//get all info from keys.json to show that we are reputable
passport.use(new GoogleStrategy({
    clientID: KEYS["google-client-id"],
    clientSecret: KEYS["google-client-secret"],
   //callbackURL: "http://localhost:3000/auth/google/callback"
   callbackURL: "https://trin-roundtable.herokuapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile = profile; //so we can see & use details form the profile
    return done(null, userProfile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*
  This triggers the communication with Google
*/
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email','profile']
  }));

/*
  This callback is invoked after Google decides on the login results
*/
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/error?code=401'
  }),
  function(request, response) {
    response.redirect('/');
  });

router.get("/auth/logout", (request, response) => {
  request.logout();
  response.redirect('/');
});

module.exports = router;
