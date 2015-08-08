var express		= require('express');
var http		= require('http');
var path		= require('path');
var connection	= require('express-myconnection');
var mysql		= require('mysql');
var bodyParser 	= require('body-parser');
var errorhandler= require('errorhandler');
var users		= require('./Routes/users');
var tasks		= require('./Routes/tasks');
var app			= express();
var flash 		= require('connect-flash');
var passport	= require('passport');
var morgan      = require('morgan');
var cookieParser= require('cookie-parser');
var session     = require('express-session');

app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(cookieParser());
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(function(req, res, next){
	var err = req.session.error,
    msg = req.session.notice,
    success = req.session.success;

  	delete req.session.error;
  	delete req.session.success;
  	delete req.session.notice;

  	if (err) res.locals.error = err;
  	if (msg) res.locals.notice = msg;
  	if (success) res.locals.success = success;

  	next();
});

var port = process.env.PORT || 8080; 

require('./Routes')(app);

app.listen(port);
console.log('Magic happens on port ' + port);

app.get('*', function(req, res) {                        
    res.sendfile('./public/index.html');                
});