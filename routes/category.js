var router = require('express').Router();
var Category = require('../models/category');

router.get('/admin/add-Category', function(req, res){
  res.render('admin/category/addCategory.ejs', {success : req.flash('success'), error : req.flash('error') })
});

router.post('/admin/add-Category', function(req,res,next){
  var category = new Category();
  category.name = req.body.name;

  category.save(function(err){
    if(err) return next(err);
    req.flash('success', 'la categorie a été ajouté avec success');
    return res.redirect('/admin/add-Category');
  });
});


module.exports = router;
