

var router = require('express').Router();
var Product = require('../models/products');
var Cart = require('../models/cart');
var User = require('../models/users');
var async = require('async');
//go to https://dashboard.stripe.com/account/apikeys
//and copy the test secret key :=> sk_test_lXFBzBvZhEWeUo5IrEf4a9Wb
var stripe = require('stripe')('sk_test_lXFBzBvZhEWeUo5IrEf4a9Wb');

//create a mapping for product
 Product.createMapping(function(err, mapping){
   if (err){
     console.log('error creating mapping : ');
     console.log(err);
   }else{
     console.log('mapping created :)');
     console.log(mapping);
   }
 });

 var stream = Product.synchronize();
 var count = 0;
 stream.on('data', function(){
   count++;
 });
 stream.on('close', function(){
   console.log('indexed '+count+' documents')
 });
 stream.on('error', function(err){
   console.log(err);
 });
//function pagination
function paginate(req, res, next){
  var perPage = 9;
  var page = req.params.page -1;
  if(!page){
    page = 0
  }
  console.log(page);
  Product.find()
          .skip(perPage * page)
          .populate('category')
          .limit(perPage)
          .exec(function(err, products){
            if(err) return next(err);
            Product.count().exec(function(err, count){
              if(err) return next(err);
              res.render('pages/home', {
                products : products,
                pages : Math.ceil(count / perPage),
                page : page + 1
              });
            })
          });
}
   //get page cart
  
router.get('/cart', function(req, res, next) {
  Cart
    .findOne({ owner: req.user._id })
    .populate('items.item')
    .exec(function(err, foundCart) {
      if (err) return next(err);
        console.log(foundCart);
      res.render('pages/cart', {
        foundCart: foundCart,

        message: req.flash('remove')
      });
    });
});
   //add product to cart
router.post('/product/:product_id', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, cart) {
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity)
    });

    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

    cart.save(function(err) {
      if (err) return next(err);
      return res.redirect('/cart');
    });
  });
});

// remove product from cart
router.post('/remove', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
    foundCart.items.pull(String(req.body.item));

    foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
    foundCart.save(function(err, found) {
      if (err) return next(err);
      req.flash('remove', 'Successfully removed');
      res.redirect('/cart');
    });
  });
});



//get and post for search products
router.post('/search', function(req, res, next){
  //req.body.q , les donnees poster , avec q c'est le nom du champ search
  res.redirect('/search?q='+ req.body.q);
});
router.get('/search', function(req, res, next){
 if(req.query.q){
    Product.search({
      query_string : {query : req.query.q }
    }, function(err, resultats){
      if(err) return next(err);
      var data = resultats.hits.hits.map(function(hit){
        return hit;
      });
     // res.json(data);
      console.log(data);
      res.render('pages/search', {
        query : req.query.q,
        products : data
      });
    });
 }
});

//get home
  router.get('/' , function(req, res, next){

      paginate(req,res, next);
  });//home pagination
  router.get('/page/:page' , function(req, res, next){
      paginate(req,res, next);
  });
  // a propos , and contact pages
router.get('/apropos' , function(req, res, next){
   res.render('pages/apropos')
 });

router.get('/contact' , function(req, res, next){
    res.render('pages/contact')
  });

//find product by category
router.get('/products/:id', function(req, res, next){
  Product.find({category : req.params.id})
         .populate('category')
         .exec(function (err, products){
           if(err) return next(err);
           res.render('pages/products',{ products : products});
         })
});
//find product by _id
router.get('/product/:id', function(req, res, next){
  Product.findById({_id : req.params.id},function(err, product){
    if(err) return next(err);
    res.render('pages/single', {product : product});
  })
});

//payment methode with stripe
router.post('/payment', function(req, res, next){
    // Get the credit card details submitted by the form
    var stripeToken = req.body.stripeToken; // Using Express
    var currentsCharge = Math.round(req.body.stripeMoney * 100); //stripeMoney = totale / 10usd*100 = 1000
      stripe.customers.create({
          source: stripeToken
      }).then(function(customer) {
            return stripe.charges.create({
                 amount: currentsCharge, // Amount in cents
                 currency: "usd",
                 customer: customer.id
            });
       }).then(function(charge){
          async.waterfall([
            function(callback){
              Cart.findOne({ owner : req.user._id}, function(err, cart){
                    callback(err, cart);
              })
            },
            function(cart, callback){
                User.findOne({ _id : req.user._id}, function(err, user){
                  if(user){
                    for(var i = 0; i < cart.items.length; i++){
                      user.history.push({
                        paid : cart.items[i].price,
                        item : cart.items[i].item
                      });
                   };
                   user.save(function(err, user){
                     if(err) return next(err);
                     callback(err, user);
                   });
                 }
               });
            },
            function(user){
              Cart.update({ owner: user._id }, { $set: { items: [], total: 0 }}, function(err, updated) {
                  if (updated) {
                    res.redirect('/profile');
                  }
              });
            }
          ]);
       });
});

module.exports = router;
