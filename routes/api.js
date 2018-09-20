var express = require('express');
var router = express.Router();

var Category = require('../models/category.js');
var Product = require('../models/product.js');
var Order = require('../models/order.js');
var Cart = require('../models/cart.js');
var User  = require('../models/user.js');


module.exports = function (app) {
	app.route('/api/products/:page/:numItems')
	.get(function (req, res, next) {
		var page = parseInt(req.params.page);
		var numItems = parseInt(req.params.numItems);
		Product.find().skip(page*numItems).limit(numItems).exec(function (err, docs) {
			if (err) {
				return res.status(500).json(err);
			} else {
				return res.status(200).json(docs);
			}
		});
	});

	app.route('/api/product/:id')
	.get(function (req, res, next) {
		var id = req.params.id;
		Product.findOne({id: id}).exec(function (err, doc) {
			if (err) {
				return res.status(500).json(err);
			} else {
				return res.status(200).json(doc);
			}
		});

	})
	.put(function (req, res, next) {
		var id = req.params.id;
		var price = req.body.price;
		Product.findOne({id: id}, function (err, doc) {
			if (err) {
				return res.status(500).json(doc);
			} else {
				doc.price = price;
				doc.save(function (err, result) {
					return res.status(200).json(result);
				});
			}
		});
	});
	return app;
}
