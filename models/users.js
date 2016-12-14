var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
/**
 * the users attributes , schema mongoose;
 */
 var Schema = mongoose.Schema;

 var usersSchema = new Schema({
   email:{type: String , unique:true},
   password: String,
   facebook : String,
   google : String,
   tokens : Array,
   profile:{
     names :  {type : String, default:""},
     picture :  {type: String , default:""}
   },
   adresse :String,
   history : [{
     date : Date,
     paid : {type : Number, default : 0},
     item : {type : Schema.Types.ObjectId , ref: 'Products' }
   }]
 });

 /**
  * hashage du password pour l'insersion des donnees users;
  */
usersSchema.pre('save', function(next){
      var user = this;
      if(!user.isModified('password')) return next();
      bcrypt.genSalt(10, function( err, salt){
        if( err ) return next( err );
                                        //dependence
        bcrypt.hash(user.password, salt, null, function( err, hash){
          if( err ) return next( err );
          user.password = hash;
          next();
        });
      });
});

/**
 * comparaison de deux passwords
 */
 usersSchema.methods.comparePassword = function(password){
   return bcrypt.compareSync(password, this.password);
 }
 usersSchema.methods.gravatar = function(size){
   if(!this.size) size=150;
   if(!this.email) return 'https://gravatar.com/avatar/?s='+size+'&d=mm';
   var md5 = crypto.createHash('md5').update(this.email).digest('hex');
   return 'https://gravatar.com/avatar/'+md5+'?s='+size+'&d=mm';
 }

module.exports = mongoose.model('User', usersSchema);
