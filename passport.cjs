const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const routes = require('./queries.cjs')
ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;




//set up
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'imasecretkey';

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
  console.log('running passport authenticate');
let user;
try{
  user = await routes.pool.query('SELECT * FROM users WHERE user_id = $1', [jwt_payload.user_id])    
  if(!user) {
    return done(null, false)
  }
    else if(user.rows[0].is_admin === true){
      console.log('admin ')
     return done(null, user, {message: "Admin logged in"})
    }
    else
    console.log('user ')
    return done(null, user) 
}  
catch(err){
  console.log('error at end')
  return done(null, err)
}
}));


