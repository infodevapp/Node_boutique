

 var express = require('express');// express js , moteur de routing
var config = require('./config/config');
//permet de connecter a la base de donnees mongolab en ligne : mongolab.com
var mongoose = require('mongoose');
//nous permet d'envoyer un message dans la console en cas de success du chargement de la page ou en cas d'erreur
var morgan = require ('morgan');
//ejs le moteur de templating
 var ejs = require('ejs');
 var ejsMate = require('ejs-mate');

 var session = require('express-session'); //session
 var cookieParser = require('cookie-parser'); //cookie-parser
 var flash = require('express-flash'); //express-flash
 var connectStore = require('connect-mongo/es5')(session);
 var passport = require('passport');
 // body parser : requperationn des donnees du formulaire ou fonction request.body.message
 var bodyParser = require('body-parser');
 // passer les categories a tous les page
 var Category = require('./models/category');
 var app = express();

//middlwaires
//pour activer morgan il faut utiliser le middlwaires
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true },
  store: new connectStore({url:config.db , autoReconnect:true})
}));

// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
//initialisation du package passport,et session
app.use(passport.initialize());
 app.use(passport.session());
app.use(flash());// flash message
// activation de ejs-mate
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static('prod'));
// connexion a la base de donnees
mongoose.connect(config.db, function(err){
  if(err) console.log(err);
  else console.log("connexion a la base de donnees avec succes");
});
//function : envoie de session qui contient l'utilisateur a tous les autre page du site
app.use(function(req, res, next){
   res.locals.user = req.user;
   next();
});
//function middleware partage de liste des categories
app.use(function(req, res, next){
    Category.find({},function(err, categories){
    if (err) return next(err);
    res.locals.categories = categories;
    next();
  })
});
//importation de middlwaire
var cartTotal = require('./middlewares/middlewares');
app.use(cartTotal);
//routes
var mainRouter = require('./routes/main');//rquire le fichier des routes des pages
app.use(mainRouter);// middlwaire
var usersRouter = require('./routes/users');//rquire les fichier de l'espace membre
app.use(usersRouter); // middlwaire
var adminCategoryRouter = require('./routes/category');
app.use(adminCategoryRouter);
var apiProducts = require('./api/api');
app.use('/api', apiProducts);
// port
app.listen(config.port);
