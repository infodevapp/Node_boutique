

var router = require('express').Router();

router.get('/' , function(req, resp){
  resp.render('pages/home')
});

router.get('/apropos' , function(req, resp){
   resp.render('pages/apropos')
 });

router.get('/contact' , function(req, resp){
    resp.render('pages/contact')
  });

module.exports = router;
