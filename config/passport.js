/**
 * Passport est l' authentification middleware pour Node.js.
 * Extrêmement flexible et modulaire, Passeport peut être discrètement
 * abandonné pour toute application basée sur le Web-Express.
 * Un ensemble complet d'authentification de soutien aux stratégies
 * en utilisant un nom d' utilisateur et mot de passe , Facebook , Twitter , et plus .
 */

var passport = require('passport');
// la strategie de connection : local, facebook, google, linked_in ...
var localStrategy = require('passport-local').Strategy;
//inclure le model user pour verifier les donnees
var User = require('../models/users');


//serialisation du session

passport.serializeUser(function(user, done){
  done(null, user._id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//middlwaires

passport.use('local-login', new localStrategy({
  //name of field in form login , username and password // imporatante
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback: true
    },function(req, email, password, done){//done function du retour callback
        User.findOne({email : email}, function(err, user){
            if (err) return done(err);
            if (!user) {
              return done(null, false, req.flash('loginMessage', 'No user has been found'));
            }
            if (!user.comparePassword(password)) {
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password pal'));
            }
          return done(null, user);
          //session store :
          //req.user._id // req.user.profile.names //....
        })
    }));
// verification si l'utilisateur et connecter ou non
exports.isAuthenticated = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  return res.redirect('login');
}
