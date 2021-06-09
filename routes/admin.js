const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');


/* Controllers */
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require('../controllers/admin');

/***
 * @router  GET: /admin/add-product
 * @desc    Renders view to creating new product
 * @access  Private
 * ***/
router.get('/add-product', isAuth, getAddProduct);

/***
 * @router  GET: /admin/products
 * @desc    Returns all products to the admin
 * @access  Private
 * ***/
router.get('/products', isAuth, getProducts);

/***
 * @router  POST: /admin/add-product
 * @desc    Create new product
 * @access  Private
 * ***/
router.post('/add-product', isAuth, postAddProduct);

/***
 * @router  GET: /admin/edit-product/:productId
 * @desc    Edit product
 * @access  Private
 * ***/
router.get('/edit-product/:productId', isAuth, getEditProduct);

/***
 * @router  POST: /admin/edit-product
 * @desc    Save edited product
 * @access  Private
 * ***/
router.post('/edit-product', isAuth, postEditProduct);

/***
 * @router  POST: /admin/delete-product
 * @desc    Delete product
 * @access  Private
 * ***/
router.post('/delete-product', isAuth, deleteProduct);

module.exports = router;
