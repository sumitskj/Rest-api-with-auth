var mongoose  = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var User = new Schema({

    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

var userSchema = mongoose.model('User', User);
module.exports = userSchema;
