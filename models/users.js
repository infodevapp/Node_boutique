var bcrypt = require('bcrypt-nodejs');

/**
 * the users attributes , schema mongoose;
 */
 var Schema = mongoose.Schema;

 var usersSchema = new Schema({
   email:{type: String , unique:true},
   password: String,
   profile:{
     names :  {type : String, default:""},
     picture :  {type: String , default:""}
   },
   adresse :String,
   history : [{
     date : Date,
     paid : {type : Number, default : 0}
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

module.exports = mongoose.model('User', usersSchema);
