var express    = require('express');
var mongoose   = require('mongoose');
var app        = express();

var port = process.env.PORT || 8080;  

app.listen(port);
console.log('Magic happens on port ' + port);