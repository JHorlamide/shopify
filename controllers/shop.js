const asyncMiddleware = require('../middleware/async');
const Product = require('../models/mongodb models/Product');
const Order = require('../models/mongodb models/Order');

exports.getProducts = asyncMiddleware(async (req, res) => {
  const products = await Product.find().populate('userId');

  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
  });
});

/* Get single product */
exports.getProduct = asyncMiddleware(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products',
  });
});

/* Get all products */
exports.getIndex = asyncMiddleware(async (req, res) => {
  const products = await Product.find();

  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
  });
});

/* Get cart */
exports.getCart = asyncMiddleware(async (req, res) => {
  const cartProducts = await req.user
    .populate('cart.items.productId')
    .execPopulate();
  const products = cartProducts.cart.items;

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: products,
  });
});

/* Create cart */
exports.postCart = asyncMiddleware(async (req, res) => {
  const product = await Product.findById(req.body.productId);
  await req.user.addToCart(product);
  res.redirect('/cart');
});

/* Delete cart */
exports.postCartDeleteProduct = asyncMiddleware(async (req, res) => {
  const product = await Product.findById(req.body.productId);
  await req.session.user.deleteCart(product);
  res.redirect('/cart');
});

/* Create new Order */
exports.postOrder = asyncMiddleware(async (req, res) => {
  const cartProducts = await req.user
    .populate('cart.items.productId')
    .execPopulate();

  const products = cartProducts.cart.items.map((product) => {
    return {
      quantity: product.quantity,
      product: { ...product.productId._doc },
    };
  });

  const order = new Order({
    user: {
      name: req.user.name,
      userId: req.user.id,
    },

    products,
  });

  /* Save the order */
  await order.save();

  /* Clear the cart */
  await req.user.clearCart();

  res.redirect('/orders');
});

/* Render view for orders */
exports.getOrders = asyncMiddleware(async (req, res) => {
  const orders = await Order.find({ 'user.userId': req.user.id });

  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
  });
});

/* Render view for checkout */
exports.getCheckout = asyncMiddleware(async (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
});
