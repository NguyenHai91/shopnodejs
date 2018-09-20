
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var user = new Schema({
	username: {type: String},
	password: {type: String},
	email: {type: String},
	level: {type: Number}
}, {collection: 'user'});

user.methods.hashPassword = function (password) {
	return bcrypt.hashSync(password, 10);
}

user.methods.comparePassword = function (password,hash) {
	return bcrypt.compareSync(password,hash)
}

module.exports = mongoose.model('user', user,'user');