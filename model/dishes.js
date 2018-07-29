var mongoose = require('mongoose');

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var Schema = mongoose.Schema;

var commentSchema = new Schema({
  rating:{
    type: Number,
    max: 5,
    min: 1,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
},{
  timestamp: true
});


var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false
    },
    comments:[commentSchema]
}, {
    timestamps: true
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;
