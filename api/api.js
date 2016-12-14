var router = require('express').Router();
var async = require('async');
var faker = require('faker');
faker.locale = "fr";//middleware //langue
var Category = require('../models/category');
var Products = require('../models/products');

//api search dynamic
router.post('/search', function(req, res, next){
  //console.log(req.body.search_term);
    Products.search({
        "bool" : {
            "must" : [{
                "query_string" : {
                    "query" : req.body.search_term
                }
            }],
            "should" : [{
                "match_phrase" : {
                    "name" : req.body.search_term
                }
            }]
        }
    }, function(err, results){
    if(err) return next(err);
    res.json(results);
  });
});
//api/category-name
router.get('/:name', function(req , res, next){
  async.waterfall([
    function (callback) {
      Category.findOne({name : req.params.name}, function(err, category){
        if(err) return next(err);
        callback(null, category);
      });
    },
    function(category, callback){
      for (var i =0 ; i < 40 ; i++){
      var product = new Products();
          product.category = category._id;
          product.name = faker.commerce.productName();
          product.price = faker.commerce.price();
          product.image = faker.image.image();
          product.quantite = faker.random.number();
          product.description = faker.commerce.productAdjective();
                               //+' // '+faker.commerce.productMaterial();
          product.save();
      }
    },
  ]);
  res.json({message : " success"});
});
module.exports = router;
