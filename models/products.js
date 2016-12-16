var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic'); //search for elasticsearch ,
       //recherche de produit par lma moteur de recherche utiliser par elasticsearch
 var Schema = mongoose.Schema;

var productSchema = new Schema({
  name : {type : String, unique: true, lowercase:true},
  price : Number ,
  description : String,
  quantite : Number,
  image : String,
  category : {type : Schema.Types.ObjectId , ref : 'Category'}
});

productSchema.plugin(mongoosastic, {
  hosts : [
    "https://syil3rt044:nodhu6uit7@sandbox-cluster-3830265252.us-east-1.bonsaisearch.net"
   // "localhost:9200"
  ]
});

module.exports = mongoose.model('Products', productSchema);
