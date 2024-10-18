const passport = require('passport'); // I import Passport for handling authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy; // I import Google OAuth strategy
const User = require('../models/user'); // I import the User model from MongoDB

// Configure the Google OAuth strategy for Passport
passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID, // I load the client ID from the .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // I load the client secret from .env
      callbackURL: process.env.GOOGLE_CALLBACK // This should match the registered redirect URI in the Google Cloud Console
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Check if a user already exists with the given Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If user exists, pass it to the callback
        return cb(null, user);
      }

      // If user doesn't exist, create a new one
      user = await User.create({
        name: profile.displayName, // User's display name from Google profile
        googleId: profile.id,      // Google ID
        email: profile.emails[0].value, // User's email from Google profile
        avatar: profile.photos[0].value // User's avatar from Google profile
      });

      // Pass the newly created user to the callback
      return cb(null, user);
      
    } catch (err) {
      // Handle errors during user creation or lookup
      return cb(err);
    }
  })
);

// Serialize the user ID into the session
passport.serializeUser((user, done) => {
  done(null, user.id); // I serialize the user by their ID to store in the session
});

// Deserialize the user ID from the session to retrieve the user object
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // I find the user in MongoDB by ID
    done(null, user); // I pass the user object to the request
  } catch (err) {
    done(err); // If there's an error, I handle it
  }
});

module.exports = passport; // I export the passport configuration to use in other parts of the app