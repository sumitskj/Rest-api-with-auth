var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var User = require('../model/users');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
  req.body.password, (err, user) => {
    if(err){
      res.statusCode= 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err :err});
    }else{
      res.statusCode= 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'Registration Successful!', user: user});
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }else{
    var err = new Error('You are didnt login.');
    err.status = 403;
    next(err);
  }
});

module.exports = router;