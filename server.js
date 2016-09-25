

 var express = require('express');
var bodyParser = require('body-parser');
var mangoose = require('mangoose');
 var app = express();

//routes;

 app.get('/' , function(req, resp){
   resp.send('salut les gent , je suit la');
 });

 app.get('/cc' , function(req, resp){
   resp.send('cc les gent , je suit la');
 });
// port
app.listen(1337);
