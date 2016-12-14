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
var FacebookStrategy = require('passport-facebook').Strategy;

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var async = require('async');
var config = require('./config');

var Cart = require('../models/cart');
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


    passport.use('Facebook-login', new FacebookStrategy(config.facebook,
      function(token, refreshToken, profile, done) {
        console.log(profile);
        User.findOne({facebook:profile.id}, function(err, user) {
          if (err) { return done(err); }
          if(user){
            done(null, user);
          }else{
            async.waterfall([
              function(callback){
                newUser = new User();
                newUser.profile.names = profile.displayName;
                newUser.facebook = profile.id;
                newUser.email = profile._json.email;
                newUser.profile.picture = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
                newUser.tokens.push({kind : 'facebook', token : token});

                newUser.save(function(err){
                  if(err) throw err;
                    callback(err, newUser);
                });
              },
              function(newUser){
                var cart = new Cart();
                cart.owner = newUser._id;
                cart.save(function(err){
                  if(err) return next(err);
                  return done(err, newUser);
                })
              }
            ]);

          }

        });
      }
    ));

// authentification avec google ,gmail
passport.use('google-login',new GoogleStrategy(config.google,
  function( token, refreshToken, profile, done) {
    User.findOne({google:profile.id}, function(err, user) {
      if (err) { return done(err); }
      if(user){
        done(null, user);
      }else{
        async.waterfall([
          function(callback){
            newUser = new User();
            newUser.profile.names = profile.displayName;
            newUser.google = profile.id;
            newUser.email = profile.emails[0].value;
            newUser.profile.picture = profile.photos[0].value;
            newUser.tokens.push({kind : 'google', token : token});

            newUser.save(function(err){
              if(err) throw err;
                callback(err, newUser);
            });
          },
          function(newUser){
            var cart = new Cart();
            cart.owner = newUser._id;
            cart.save(function(err){
              if(err) return next(err);
              return done(err, newUser);
            })
          }
        ]);

      }

    });
  }
));

// verification si l'utilisateur et connecter ou non
exports.isAuthenticated = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  return res.redirect('/login');
}
