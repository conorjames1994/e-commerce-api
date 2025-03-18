// adminStrategy.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const routes = require('./queries.cjs')

passport.use('admin', new LocalStrategy({
  usernameField: "username"
}, async (username, done) => {
  const admin = await routes.pool.query('SELECT * FROM users WHERE username = $1', [username])
  if(!admin){
    return done(null, false)
  }
  else if(admin.rows[0].is_admin === true){
    return done(null, admin)
  }
  else{
    return done(null, false)
  }
}))