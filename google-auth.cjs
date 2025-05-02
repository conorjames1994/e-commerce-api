const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = new GoogleStrategy({
  clientID: process.env.google_id,
  clientSecret: process.env.google_client_secret,
  callbackURL: 'http://localhost:5173/auth0',
  scope: ['profile', 'email'],
}, (accessToken, refreshToken, profile, cb) => {
  // Verify the user and return the user object
  // ...
});