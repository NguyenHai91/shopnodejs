var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var product = new Schema({
	id: {type: Number},
	name:  {type: String, required: true},
	price: {type: Number,required: true},
	image: String,
	description: String,
	category_id: {type: Number , default: 1},
},{collection: "product"});

module.exports = mongoose.model('product',product);