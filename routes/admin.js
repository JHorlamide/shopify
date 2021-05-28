const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

/* Controllers */
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
  createUser
} = require('../controllers/admin');

/***
 * @router  GET: /admin/add-product
 * @desc    Renders view to creating new product
 * @access  Private
 * ***/
router.get('/add-product', getAddProduct);

/***
 * @router  GET: /admin/products
 * @desc    Returns all products to the admin
 * @access  Private
 * ***/
router.get('/products', getProducts);

/***
 * @router  POST: /admin/add-product
 * @desc    Create new product
 * @access  Private
 * ***/
router.post('/add-product', postAddProduct);

/***
 * @router  GET: /admin/edit-product/:productId
 * @desc    Edit product
 * @access  Private
 * ***/
router.get('/edit-product/:productId', getEditProduct);

/***
 * @router  POST: /admin/edit-product
 * @desc    Save edited product
 * @access  Private
 * ***/
router.post('/edit-product', postEditProduct);

/***
 * @router  POST: /admin/delete-product
 * @desc    Delete product
 * @access  Private
 * ***/
router.post('/delete-product', deleteProduct);


/* create user */
router.post('/user', createUser); 

module.exports = router;
