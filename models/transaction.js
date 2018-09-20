var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var transaction = new Schema({
	id: {type: Number},
	fullname:  {type: String},
	phone: {type: String},
	email: {type : String},
	address: {type : String},
	orders: {type : Array, default: []},
	amount: {type : Number},
	payment: {type : String, default: 'cash'},
	created: {type : Date, default: Date.now()}

}, {collection : "transaction"});

module.exports = mongoose.model('transaction',transaction);