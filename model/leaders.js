var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default:false
    },
    abbr: {
      type: String,
      default: ''
    }
}, {
    timestamps: true
});

var leader = mongoose.model('Leader', leaderSchema);

module.exports = leader;
