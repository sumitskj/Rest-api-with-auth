var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var filestore = require('session-file-store')(session);
var passport = require('passport');

var indexRouter = require('./routes/index');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/PromoRouter');
var dishRouter = require('./routes/dishRouter');
var userRouter = require('./routes/users');
var favoritesRouter = require('./routes/favoritesRouter');

var config = require('./config');
var authenticate = require('./authenticate');
const url = config.mongourl;

var app = express();

//app.use(cookieParser('1234-4267-2325-2224'));
app.use(session({
  name: 'session-id',
  secret: '1234-2323-2145-6767',
  resave: false,
  saveUninitialized: false,
  store: new filestore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', userRouter);



//const url = 'mongodb://localhost:27017/rest';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected succesfully.');
}, (err) => {
  console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);
app.use('/favorites',favoritesRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
