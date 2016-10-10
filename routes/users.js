var router = require('express').Router(); // require de express router
var User = require('../models/users');
var passport = require('passport');
var passportConf = require('../config/passport');


// get inscription interface
 router.get('/register', function(req, res, next){
   res.render('accounts/register', {errors : req.flash('errors')});
 });
 // post inscription form
 router.post('/register' , function(req, resp, next){
   var user = new User();
   //utilisation du body parser pour requperer les donnees
   user.email= req.body.email;
   user.password = req.body.password;
   user.profile.names = req.body.names;
   user.profile.picture = user.gravatar();
//utiliser User et pas user,require('../models/users').findOne({},function(err, existUser){})
   User.findOne({ email : req.body.email }, function(err, existingUser){
     if(existingUser){
       req.flash('errors', 'erreur : email existe déja!');
       return resp.redirect('/register');
     }else{
       user.save(function(err){
         if(err) return next(err);
         req.logIn(user, function(err){
           if(err) return next(err);
           resp.redirect('/profile');
         })
       });
     }
   });
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
router.get('/profile', function(req, res, next){
      res.render('accounts/profile');
});
//router rdit profile get and post
router.get('/edit-Profile', function(req, res , next){
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




 module.exports = router;
