'use strict';
var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const {ObjectId} = require('mongodb');


var Category = require('../models/category.js');
var Product = require('../models/product.js');
var ProductDetails = require('../models/product_details.js');
var Order = require('../models/order.js');
var Cart = require('../models/cart.js');
var User  = require('../models/user.js');
var Transaction  = require('../models/transaction.js');

module.exports = {
  getIndex: function(req, res, next) {
    Product.find({}).sort({id : -1}).skip(0).limit(8).then(function (data) {
      let user;
      if (req.isAuthenticated()) {
        user = req.user;
        res.render('index', {data: data, user: user});
      }
      res.render('index', {data: data});
    });

  },
  getLogout: function (req, res, next) {
    req.logout();
    res.redirect('/');
  },
  getLogin: function (req, res, next) {
    res.render('login');
  },
  userLogin: function (req, res) {
    res.send('hey');
  },
  getSignup: function (req, res, next) {
    res.render('signup');
  },
  createUser: function (req, res, next) {
    var body = req.body;
    var username = body.username;
    var password = body.password;
    User.findOne({'username': username}, function (err, user) {
      if (err) {
        res.status(500).send('error occured with db');
      } else {
        if (user) {
          res.status(500).send('user already exists');
        } else {
          var newUser = new User();
          newUser.username = username;
          newUser.password = newUser.hashPassword(password);
          newUser.save(function (err, userResult) {
            if (err) {
              res.status(500).send('save error');
            } else {
              res.redirect('/login');
            }
          });
        }
      }
    });
  },
  deleteOrder: function (req, res, next) {
    var id = req.params.id;
    var cart = new Cart(req.session.cart);
    cart.delete(id);
    req.session.cart = cart;
    res.redirect('/cart');
  },
  updateCart: function (req, res, next) {
    var _id = ObjectId(req.params.id);
    var quantity = req.params.quantity;
    var cart = new Cart(req.session.cart);
    cart.update(id, quantity);
    req.session.cart = cart;
    res.send("OK");
  },
  addCart: function (req, res, next) {
    let _id = ObjectId(req.params.id);
    let color = req.query.color;
    let size = req.query.size;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
    Product.findOne({'_id': _id}).exec(function (err, product) {
     cart.add(_id, product, color, size);
     req.session.cart = cart;
     return res.sendStatus(200);
   });
  },
  selectColor: function (req, res, next) {
    let _id = ObjectId(req.params.id);
    let color = req.query.color;
    console.log(color)
    ProductDetails.findOne({'product_id': _id, color: color}).distinct('size', function (err, sizes) { 
      if (err) { throw err; }
      let data = {'sizes': sizes};
      res.send(sizes);
    });
  },
  getCart: function (req, res, next) {
    if (!req.session.cart) {
      res.render('cart', {'data': [],user: req.user});
    }
    var cart = new Cart(req.session.cart);
    if (Object.keys(cart.items).length == 0) {
      res.redirect('/');
    } else {
      var data = cart.convertArray();
      let user;
      if (req.isAuthenticated()) {
        user = req.user;
      }
      res.render('cart', {'data' : data, user: user});
    }
  },
  getMenu: function(req, res, next) {
    Category.find().then(function (data) {
      res.json(data);
    });
  },
  getCate: function(req, res, next) {
    var id = req.params.id;
    Category.findOne({'id' : id}).then(function (cate) {
      Product.find({'category_id' : id}).then(function (listProduct) {
        let user;
        if (req.isAuthenticated()) {
          user = req.user;
        }
        res.render('categories',
        {
          'cate' : cate,
          'listProduct' : listProduct,
          user: user
        });
      });
    });
  },
  getDetailProduct: function(req, res, next) {
    var _id = ObjectId(req.params.id);
    var cate = req.params.cate;
    Product.findOne({'_id' : _id}).then(function (product) {
      Category.findOne({'id' : product.category_id}).then(function (cate) {
        Product.find({'category_id' : cate.id}).skip(0).limit(4).sort({id : -1}).then(function (relatedItem) {
          let user;
          if (req.isAuthenticated()) {
            user = req.user;
          }
          ProductDetails.find({'product_id': product._id}).distinct('color', function (err, colors) {
            ProductDetails.find({'product_id': product._id, 'color': colors[0]}).distinct('size', function (err, sizes) {
              res.render('product_detail',
              {
                'product' : product,
                'colors': colors,
                'sizes': sizes,
                'cate': cate,
                'relatedItem' : relatedItem,
                'user': user
              });
            });
            
          });
          
        });
      })
      .catch(function (err) {
        if (err) { throw err; }
      });

    })
    .catch(function (err) {
      if (err) { throw err; }
    });
  },
  getCheckout: function (req, res, next) {
    if (typeof req.session.cart.items !== undefined) {
      var listItems = Object.values(req.session.cart.items);
      res.render('checkout', {'user': req.user, 'cart': listItems});
    } else {
      res.send('Not have item to checkout !');
    }
  },
  createTransaction: function (req, res, next) {
    if (req.session.cart) {
      var body = req.body;
      var cartItems = Object.values(req.session.cart.items);
      Transaction.findOne().sort({'id': -1}).skip(0).limit(1).exec(function (err, result) {
        if (err) throw err;
        var newTrans = new Transaction();
        if (result) {
          newTrans.id = result.id + 1;
        } else {
          newTrans.id = 1;
        }
        newTrans.fullname = body.txtFullname;
        newTrans.email = body.txtEmail;
        newTrans.address  = body.txtAddress;
        newTrans.phone = body.txtPhone;
        newTrans.message = body.txtMsg;
        let amount = 0;
        cartItems.forEach(function (value) {
          amount += value.amount;
        });
        newTrans.amount = amount;
        
        let arrOrder = [];
        cartItems.forEach(function (el) {
          Order.findOne().sort({'id': -1}).skip(0).limit(1).exec(function (err, result) {
            if (err) throw err;
            var newOrder = new Order();
            if (result) {
              newOrder.id = result.id + 1;
            } else {
              newOrder.id = 1;
            }
            newOrder.product = el.item;
            newOrder.quantity = el.quantity;
            newOrder.amount = el.item.price * el.quantity;
            newOrder.save(function (err, order) {
              newTrans.orders.push(order);
              newTrans.save(function (err, transaction) {
                if (err) { throw err; }
                // create transport to send mail
                let transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  secure: false,
                  auth: {
                    user: 'aloha4391@gmail.com',
                    pass: '@hai1991'
                  }
                });
                // set mail data
                let mailOptions = {
                  from: 'aloha4391@gmail.com',
                  to: 'hainguyen4391@gmail.com',
                  subject: 'Order Success',
                  text: 'Your order is success, we will ship for you quickly.',
                  html: '<b>Hello Aloha !</b><p>Your order is success, we will ship for you quickly.</p>'
                };
                //send mail with defined transport object
                transporter.sendMail(mailOptions, function (err, info) {
                  if (err) {
                    throw err;
                  }
                  console.log('Message sent: %s', info);
                });
              });
            });
          });
        });
        cartItems.forEach(function (value) {
          var _id  = value.item._id;
          ProductDetails.findOne({'product_id': _id, color: value.color, size: value.size}).exec(function (err, doc) {
            if (err) { throw err;}
            doc.quantity = doc.quantity - value.quantity;
            doc.save(function (err, result) {
              if (err) {
                throw err;
              }
            });
          });
        });
        req.session.cart = undefined;
        req.session.save();
        res.render('success_order');
        
      });
    } else {
      res.redirect('/');
    }
  }
}