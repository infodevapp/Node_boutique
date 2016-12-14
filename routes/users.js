var router = require('express').Router(); // require de express router
var User = require('../models/users');
var passport = require('passport');
var Cart = require('../models/cart');
var async = require('async');
var passportConf = require('../config/passport');


// get inscription interface
 router.get('/register', function(req, res, next){
   res.render('accounts/register', {errors : req.flash('errors')});
 });
 // post inscription form
 router.post('/register' , function(req, resp, next){
   async.waterfall([
     function(callback) {
       var user = new User();

       user.profile.name = req.body.name;
       user.email = req.body.email;
       user.password = req.body.password;
       user.profile.picture = user.gravatar();
//User.findOne , User = require('user')
       User.findOne({ email: req.body.email }, function(err, existingUser) {

         if (existingUser) {
           req.flash('errors', 'Account with that email address already exists');
           return res.redirect('/register');
         } else {
           user.save(function(err, user) {
             if (err) return next(err);
             callback(null, user);
           });
         }
       });
     },

     function(user) {
       var cart = new Cart();
       cart.owner = user._id;
       cart.save(function(err) {
         if (err) return next(err);
         req.logIn(user, function(err) {
           if (err) return next(err);
           return res.redirect('/profile');
         });
       });
     }
   ]);
 });

 //route login
 router.get('/login', function(req, res) {
   if (req.user) return res.redirect('/');
   res.render('accounts/login', { message: req.flash('loginMessage')});
 });

 router.post('/login',
 //local-login , le nom du middlwaire dans le fichier passport.js
   passport.authenticate(
     'local-login',
     {failureRedirect: '/login', successRedirect : '/profile', failureFlash : true }
    )
  );
// route profile
router.get('/profile', passportConf.isAuthenticated, function(req, res, next){
      User.findOne({_id : req.user._id})
          .populate('history.item')
          .exec(function(err, foundUser){
            if(err) return next(err);
              res.render('accounts/profile', {fuser : foundUser});
          });
});
//router rdit profile get and post
router.get('/edit-Profile',passportConf.isAuthenticated, function(req, res , next){
  res.render('accounts/edit-Profile', {message : req.flash('message-edit')});
});
router.post('/edit-Profile', function(req, res, next){
  //var user = new User();
  User.findOne({_id : req.user._id} ,function(err, user){
    if (err) return next(err);
    if(req.body.name) user.profile.names = req.body.name;
    if(req.body.adress) user.adresse = req.body.adress;
    user.save(function(err){
      if(err ) return next(err);
      req.flash('message-edit', 'le profile a été modifié avec success');
      res.redirect('/edit-Profile');
    });
  });
});
// route for logout
router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

//route for facebook-connect
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
//If your application needs extended permissions,
// they can be requested by setting the scope option.
router.get('/auth/facebook', passport.authenticate('Facebook-login', { scope: 'email' }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('Facebook-login', { successRedirect: '/profile',
                                      failureRedirect: '/login' }));

 // route for google+
 // GET /auth/google
 router.get('/auth/google',
      passport.authenticate('google-login', { scope: ['profile', 'email'] })
 );
 router.get('/auth/google/callback',
   passport.authenticate('google-login', { failureRedirect: '/' }),
   function(req, res) {
     res.redirect('/profile');
   }
 );

 module.exports = router;
