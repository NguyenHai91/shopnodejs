var express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
const jwt = require('jsonwebtoken');

//authorization jwt
module.exports = function (req, res, next) {
	if (req.cookies && req.cookies['auth-token']) {
		jwt.verify(req.cookies['auth-token'], 'secret', function(err, decode) {
			if (err) req.user = undefined;
			req.user = decode;
			next();
		});
	} else {
		req.user = undefined;
		next();
	}
};