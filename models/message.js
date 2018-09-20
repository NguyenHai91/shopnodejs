var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var message = new Schema({
	name_room: {type: String, required: true},
	arr_message: {type: Array}
},{collection : "message"});

module.exports = mongoose.model('message',message);