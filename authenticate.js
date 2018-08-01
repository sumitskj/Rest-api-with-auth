var passport = require('passport');
var passportStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');
var User = require('./model/users');

exports.local = passport.use(new passportStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function (user) {
    return jwt.sign( user, config.secretKey, {expiresIn : 3600})
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
//exports.verifyAdmin = passport.authenticate(req.user.admin == true);

exports.verifyAdmin = ((req, res, next) => {
    if(req.user.admin == true){
        return next();
    }else{
        var err = new Error('You are not an Admin!\n You need to have admin privilages!');
        err.status = 403;
        return next(err);
    }
});