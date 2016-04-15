var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');

var app = express();

app.use(express.static(path.join(__dirname, '../../athena')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(cookieParser());

app.use(bodyParser.json({limit: '5mb'}));


module.exports = app;

// test session
/*
var session = require('express-session')
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(function (req, res, next) {
  var views = req.session.views

  if (!views) {
    views = req.session.views = {}
  }

  views['pathname'] = 1;

  next()
})

app.get('/v5/json/syalias/getSession', function(req, res){
  req.session.id = '1x2q3o';
  var hour = 3600000
	req.session.cookie.expires = new Date(Date.now() + hour)
	req.session.cookie.maxAge = hour
	console.log(req.session)
	console.log(req.cookies)
	res.cookie('remember', 1 , { maxAge: 60000 })
  res.send(true)
});
*/
