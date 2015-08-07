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

app.use(express.static(__dirname = "public")); //Linea agregada para ver el HTML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

var port = process.env.PORT || 8080; 

require('./Routes')(app);

app.listen(port);
console.log('Magic happens on port ' + port);