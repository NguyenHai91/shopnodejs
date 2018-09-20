
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var {ObjectId} = require('mongodb');

var product_details = new Schema({
	product_id: {type: Schema.ObjectId, required: true},
	size: {type: String},
	color: {type: String},
	quantity: {type: Number},
	arr_images: {type: Array, default: []}
}, {collection: 'product_details'});

module.exports = mongoose.model('product_details', product_details);