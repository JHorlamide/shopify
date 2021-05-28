const express = require('express');
const router = express.Router();

/* Controllers */
const shopController = require('../controllers/shop');
const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  postOrder,
  getCheckout
} = require('../controllers/shop');

/***
 * @router  GET: /
 * @desc    Renders all products
 * @access  Public
 * ***/
router.get('/', getIndex);

/***
 * @router  GET: /products
 * @desc    Renders view for all products
 * @access  Public
 * ***/
router.get('/products', getProducts);

/***
 * @router  GET: /products
 * @desc    Renders view for product details
 * @access  Public
 * ***/
router.get('/products/:productId', getProduct);

/***
 * @router  GET: /cart
 * @desc    Renders views for the cart
 * @access  Public
 * ***/
router.get('/cart', getCart);

/***
 * @router  GET: /cart
 * @desc    Renders views for the cart
 * @access  Public
 * ***/
router.post('/cart', postCart);

/***
 * @router  POST: /cart/delete-item
 * @desc    Delete cart
 * @access  Public
 * ***/
router.post('/cart/delete-item', postCartDeleteProduct);

/***
 * @router  GET: /orders
 * @desc    Renders views for the orders
 * @access  Public
 * ***/
router.get('/orders', getOrders);

/***
 * @router  GET: /checkout
 * @desc    Renders views for the checkout
 * @access  Public
 * ***/
router.post('/create-order', postOrder);

/***
 * @router  GET: /checkout
 * @desc    Renders views for the checkout
 * @access  Public
 * ***/
router.get('/checkout', getCheckout);

module.exports = router;
