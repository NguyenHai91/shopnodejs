var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var order = new Schema({
	id: {type: Number},
	product: {type: Object},
	quantity: {type: Number},
	amount: {type : Number},
	created: {type : Date, default: Date.now()}

}, {collection : "order"});

module.exports = mongoose.model('order',order);