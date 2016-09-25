

 var express = require('express');// express js , moteur de routing
 // body parser :
var bodyParser = require('body-parser');
//permet de connecter ala base de donnees mongolab en ligne : mongolab.com
var mangoose = require('mangoose');
//nous permet d'envoyer un message dans la console en cas de success du chargement de la page ou en cas d'erreur
var morgan = require ('morgan');
var User = require('./models/user');
//ejs le moteur de templating
 var ejs = require('ejs');
 var app = express();

//middlwaires
//pour activer morgan il faut utiliser le middlwaires
app.use(morgan('dev'));
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// connexion a la base de donnees
mongoose.connect('mongodb://root:admin@ds035806.mlab.com:35806/node_ecommerce', function(err){
  if(err) console.log(err);
  else console.log("connexion a la base de donnees avec succes");
})

//routes;
 app.post('/register' , function(req, resp){
   var user = new User();
   user.email= req.body.email;
   user.password = req.body.password;
   user.profile.names = req.body.names;
   user.save(function(err){
     if(err) return next(err);
     res.json('utilisateur creeé avec success');
   });
 });

 app.get('/cc' , function(req, resp){
   resp.send('cc les gent , je suit la');
 });
// port
app.listen(1337);
