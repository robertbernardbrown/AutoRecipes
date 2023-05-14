const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../db/models/user');

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const util = require('util');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user || !user.comparePassword(password)) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use(new FacebookStrategy({
    clientID: 'your_facebook_app_id',
    clientSecret: 'your_facebook_app_secret',
    callbackURL: 'http://localhost:5000/auth/callback',
    profileFields: ['id', 'displayName', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOneAndUpdate(
            { facebookId: profile.id },
            { $setOnInsert: { displayName: profile.displayName, email: profile.emails[0].value } },
            { upsert: true, new: true }
        );
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use(new GoogleStrategy({
    clientID: 'your_google_client_id',
    clientSecret: 'your_google_client_secret',
    callbackURL: 'http://localhost:5000/auth/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOneAndUpdate(
            { googleId: profile.id },
            { $setOnInsert: { displayName: profile.displayName, email: profile.emails[0].value } },
            { upsert: true, new: true }
        );
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

const localAuthMiddleware = passport.authenticate('local', { session: true });
const facebookAuthMiddleware = passport.authenticate('facebook', { session: true });
const googleAuthMiddleware = passport.authenticate('google', { session: true });

router.post('/register', async function(req, res) {
    try {
      const { email, password } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const user = new User({
        email: email,
        password: hash
      });
      await user.save();
      req.login(user, function(err) {
        if (err) { throw err; }
        res.json(user);
      });
    } catch (err) {
      throw err;
    }
});

// Route for handling the login form submission
router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/callback',
    failureRedirect: '/login'
}));

router.get('/logout', requireAuth, (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.get('/local', localAuthMiddleware);
router.get('facebook', facebookAuthMiddleware);
router.get('/google', googleAuthMiddleware);

router.get('/callback', facebookAuthMiddleware, function(req, res) {
  if (req.user) {
    res.redirect(req.session.returnTo || '/');
  } else {
    res.redirect('/login');
  }
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
      // If the user is authenticated, call the next middleware function
      return next();
    } else {
      // If the user is not authenticated, redirect them to the login page
      res.send(400);
    }
}

module.exports = { 
    authRouter: router,
    helpers: {
        requireAuth
    }
};
