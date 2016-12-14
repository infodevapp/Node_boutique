var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

var catSchema = new Schema({
  name : {type : String, unique: true, lowercase:true}
});

module.exports = mongoose.model('Category', catSchema);
