var express = require('express');
var router = express.Router();
var passport = require('passport');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');


var Category = require('../models/category.js');
var Product = require('../models/product.js');
var Order = require('../models/order.js');
var Cart = require('../models/cart.js');

var User  = require('../models/user.js');

var adminController = require('../controllers/adminController');
var publicController = require('../controllers/publicController');

var adminLogin = function (req, res, next) {
	if (req.isAuthenticated()) {
		if (req.user.level === 1) {
			next();
		} else {
			res.send('Account not permision !');
		}
	} else {
		res.render('admin/admin_login');
	}
}


router.get('/', adminLogin, adminController.admin);
router.get('/login', adminLogin, adminController.getAdminLogin);
router.get('/logout', adminLogin, adminController.logout);
router.post('/login',
	[
	check('username').not().isEmpty().withMessage('username not empty !'),
	check('password').isLength({min: 3}).withMessage('password min 3 character !')
	],
	passport.authenticate('local', {
		failureRedirect: '/admin/login',
		successRedirect: '/admin'
	}),
	adminController.adminLogin);

router.get('/list-cate', adminLogin, adminController.getListCate);
router.get('/add-cate', adminLogin, adminController.getCate);
router.post('/add-cate', adminLogin,
	[
	check('txtName').not().isEmpty().withMessage('Please enter name cate that not empty !')
	],
	adminController.createCate);
router.get('/edit-cate/:id', adminLogin, adminController.getEditCate);
router.post('/edit-cate', adminLogin,
	[
	check('txtName').not().isEmpty().withMessage('Please enter name cate that not empty !')
	],
	adminController.postEditCate);
router.get('/delete/:id', adminLogin, adminController.deleteCate);

router.get('/add-product', adminLogin, adminController.getProduct);
router.post('/add-product', adminLogin,
	[
	check('slcCate').not().isEmpty().withMessage('cate_id not empty !'),
	check('txtName').not().isEmpty().withMessage('name cate not empty !'),
	check('txtDesc').not().isEmpty().withMessage('description not empty !'),
	check('numPrice').not().isEmpty().withMessage('price not empty !'),
	check('fImage').not().isEmpty().withMessage('image not empty !')
	],
	adminController.createProduct);
router.post('/product/upload-images', adminLogin, adminController.uploadImages);
router.get('/product/details/:id', adminLogin, adminController.getDetailsProduct);
router.get('/product/add-details/:id', adminLogin, adminController.getAddProductDetails);
router.post('/product/add-details', adminLogin,[
	check('txtId').not().isEmpty().withMessage('id not empty !'),
	check('txtSize').not().isEmpty().withMessage('size cate not empty !'),
	check('txtColor').not().isEmpty().withMessage('color not empty !'),
	check('numQuant').not().isEmpty().withMessage('quantity not empty !')
	],
	adminController.addProductDetails);
router.get('/product/details/delete/:id', adminLogin, adminController.deleteProductDetails);
router.get('/product/list-product', adminLogin, adminController.getListProduct);

router.get('/product/edit/:id', adminLogin, adminController.getEditProduct);
router.post('/product/edit/:id', adminLogin,
	[
	check('slcCate').not().isEmpty().withMessage('cate_id not empty !'),
	check('txtName').not().isEmpty().withMessage('name cate not empty !'),
	check('txtDesc').not().isEmpty().withMessage('description not empty !'),
	check('numPrice').not().isEmpty().withMessage('price not empty !')
	],
	adminController.postEditProduct);
router.get('/product/delete/:id', adminLogin, adminController.deleteProduct);

router.get('/add-user', adminLogin, adminController.getUser);
router.post('/add-user', adminLogin,[
	check('txtName').not().isEmpty().withMessage('username not empty !'),
	check('txtPass').not().isEmpty().withMessage('password not empty !'),
	check('txtRe-Pass').not().equals(check('txtPass')).withMessage('re-password not match !'),
	check('txtEmail').isEmail().withMessage('email not empty !'),
	check('numLevel').not().isEmpty().withMessage('level not empty !'),
	], adminController.createUser);
router.get('/user/list-user', adminLogin, adminController.getListUser);
router.get('/user/edit/:id', adminLogin, adminController.getEditUser);
router.post('/user/edit/:id', adminLogin,
	[
	check('txtName').not().isEmpty().withMessage('username not empty !'),
	check('txtEmail').isEmail().withMessage('email not empty !'),
	check('numLevel').not().isEmpty().withMessage('level not empty !'),
	],
	adminController.postEditUser);
router.get('/user/delete/:id', adminLogin, adminController.deleteUser);

module.exports = router;
