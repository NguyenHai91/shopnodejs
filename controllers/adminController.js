var express = require('express');
var router = express.Router();
var multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator/check');
const {ObjectId} = require('mongodb');

var Category = require('../models/category.js');
var Product = require('../models/product.js');
var ProductDetails = require('../models/product_details.js');
var Order = require('../models/order.js');
var Cart = require('../models/cart.js');
var User  = require('../models/user.js');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/product');
  },
  filename: function (req, file, cb) {
    file.originalname = Date.now() +'-'+ file.originalname;
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage }).single('fImage');
var arrImages = [];

module.exports = {
  admin: function (req, res, next) {
    res.render('admin/admin', {'user': req.user});
  },
  logout: function (req, res, next) {
    req.logout();
    res.redirect('/');
  },
  getAdminLogin: function (req, res, next) {
    res.render('admin/admin_login');
  },
  adminLogin: function (req, res, next) {
    User.findOne({username: req.body.username}, function (err, user) {
      if (err) throw err;
      if (user) {
        if (!user.comparePassword(req.body.password, user.password)) {
          return res.status(401).json({message: 'password wrong'});
        } else {
          var token = jwt.sign({username: user.username, _id: user._id}, 'secret');
          res.cookie('auth-token', token);
          res.redirect('/admin');
        }
      } else {
        res.status(401).json({message: 'user not found'});
      }
    });
  },
  getListCate: function (req, res, next) {
    Category.find({}).skip(0).limit(20).exec(function (err, result) {
      if (err) { throw err; }
      res.render('admin/list_cate', {'listCate': result, 'user': req.user});
    });
  },
  getCate: function (req, res, next) {
    res.render('admin/add_cate', {'user': req.user});
  },
  createCate: function (req, res, next) {
    var body = req.body;
    var newCate = new Category();
    Category.find().sort({'id': -1}).skip(0).limit(1).exec(function (err, result) {
      if (err) throw err;
      let index = result[0].id;
      newCate.id = index+1;
      newCate.name = body.txtName;
      newCate.save(function (err, result) {
        if (err) throw err;
        res.redirect('/admin/list-cate');
      });
    });
  },
  getEditCate: function (req, res, next) {
    var id = req.params.id;
    Category.findOne({'id': id}).exec(function (err, result) {
      if (err) { throw err; }
      res.render('admin/edit_cate', {'cate': result, 'user': req.user});
    });
  },
  postEditCate: function (req, res, next) {
    let body = req.body;
    let id = body.txtId;
    Category.findOneAndUpdate({id: id}, {$set:{name: body.txtName}},{new: true, overwrite: true, upsert: false}, function (err, cate) {
      if (err) { throw err; }
      res.redirect('/admin/list-cate');
    });
  },
  deleteCate: function (req, res, next) {
    let id = req.params.id;
    Category.findOneAndRemove({'id': id}, function (err, result) {
      if (err) { throw err; }
      res.redirect('/admin/list-cate');
    });
  },
  getProduct: function (req, res, next) {
    Category.find().exec(function (err, result) {
      if (err) throw err;
      res.render('admin/add_product', {'user': req.user, 'listCates': result});
    });
  },
  createProduct: function (req, res, next) {
    upload(req, res, function(err) {
      if (err) throw err;
      var body = req.body;
      var newProduct = new Product();
      Product.find().sort({'id': -1}).skip(0).limit(1).exec(function (err, result) {
        if (err) throw err;
        let index = result[0].id;
        newProduct.id = index+1;
        newProduct.name = body.txtName;
        newProduct.description = body.txtDesc;
        newProduct.price = body.numPrice;
        newProduct.image = req.file.originalname;
        newProduct.category_id = body.slcCate;
        newProduct.save(function (err, result) {
          if (err) throw err;
          console.log(result);
          let prd_id = ObjectId(result._id);
          res.render('admin/add_product_details', {'user': req.user, 'prdName': result.name, 'prdId': prd_id});
        });
      });
    });
  },
  uploadImages: function (req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        throw err;
      } else {
        arrImages.push(req.file.originalname);
      }
    });
  },
  getAddProductDetails: function (req, res, next) {
    let _id = ObjectId(req.params.id);
    Product.findOne({'_id': _id}).exec(function (err, product) {
      res.render('admin/add_product_details', {'user': req.user, 'prdName': product.name, 'prdId': _id});
    });
  },
  addProductDetails: function (req, res, next) {
    let body = req.body;
    let newPrdDetails = new ProductDetails();
    newPrdDetails.product_id = ObjectId(body.txtId);
    newPrdDetails.size = body.txtSize;
    newPrdDetails.color = body.txtColor;
    newPrdDetails.quantity = body.numQuant;
    newPrdDetails.arr_images = arrImages;
    newPrdDetails.save(function (err, result) {
      if (err) { throw err;}
      console.log(result);
      res.render('admin/add_product_details', {'user': req.user, 'prdName': req.body.txtName, 'prdId': result.product_id});
    });
  },
  deleteProductDetails: function (req, res, next) {
    let _id = ObjectId(req.params.id);
    ProductDetails.findOneAndRemove({'_id': _id}, function (err, details) {
      if (err) { throw err;}
      res.redirect(`/admin/product/details/${details.product_id}`);
    });
  },
  getListProduct: function (req, res, next) {
    Product.find().exec(function (err, result) {
      res.render('admin/list_product', {'products': result, 'user': req.user});
    });
  },
  getDetailsProduct: function (req, res, next) {
    let id = req.params.id;
    ProductDetails.find({'product_id': id}).exec(function (err, arrDetails) {
      if (err) { throw err; }
      if (arrDetails) {
        res.render('admin/list_details_product', {'user': req.user, 'arrDetails': arrDetails, '_id': id});
      }
    });
  },
  getEditProduct: function (req, res, next) {
    let id = req.params.id;
    Product.findOne({'id': id}).exec(function (err, product) {
      if (err) throw err;
      Category.find().exec(function (err, cates) {
        if (err) throw err;
        res.render('admin/edit_product', {'user': req.user, 'product': product, 'listCates': cates});
      });
    });
  },
  postEditProduct: function (req, res, next) {
    let id = req.params.id;
    upload(req, res, function(err) {
      if (err) throw err;
      let body = req.body;
      let options = {};
      if (req.file) {
        options.image = req.file.originalname;
      }
      options.name = body.txtName;
      options.price = body.numPrice;
      options.description = body.txtDesc;
      options.category_id = body.slcCate;
      Product.findOneAndUpdate({'id': id},
        {$set:
          options
        },
        {new: true, upsert: false},
        function (err, result) {
          if (err) { throw err;}
          res.redirect('/admin/product/list-product');
        });
    });     
  },
  deleteProduct: function (req, res, next) {
    let id = req.params.id;
    Product.findOneAndRemove({'id': id}, function (err) {
      if (err) { throw err; }
      res.redirect('/admin/product/list-product');
    });
  },
  getUser: function (req, res, next) {
    res.render('admin/add_user', {'user': req.user});
  },
  createUser: function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var body = req.body;
    var newUser = new User();
    newUser.username = body.txtName;
    newUser.email = body.txtEmail;
    newUser.password = newUser.hashPassword(body.txtPass);
    newUser.level = body.numLevel;
    newUser.save(function (err, result) {
      if (err) {
        throw err;
      }
      console.log(result);
    });
  },
  getListUser: function (req, res, next) {
    User.find().exec(function (err, result) {
      res.render('admin/list_user', {'listUser': result, 'user': req.user});
    });
  },
  deleteUser: function (req, res, next) {
    let id = ObjectId(req.params.id);
    User.findOneAndRemove({'_id': id}, function (err, result) {
      if (err) { throw err; }
      res.redirect('/admin/user/list-user');
    });   
  },
  getEditUser: function (req, res, next) {
    let id = ObjectId(req.params.id);
    User.findOne({'_id': id}).exec(function (err, result) {
      if (err) { throw err;}
      res.render('admin/edit_user',{'user': req.user, 'user_edit':result});
    });
  },
  postEditUser: function (req, res, next) {
    let id = ObjectId(req.params.id);
    let body = req.body;
    User.findOneAndUpdate({'_id': id}, {username: body.txtName, email: body.txtEmail, level: body.numLevel}, {new: true, upsert: false}, function (err, result) {
      if (err) { throw err;}
      res.redirect('/admin/user/list-user');
    });
  }

}