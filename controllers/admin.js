/* Custom modules */
const asyncMiddleware = require('../middleware/async');
const Product = require('../models/mongodb models/Product');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

/* Renders view for adding product */
exports.getAddProduct = asyncMiddleware(async (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
});

/* Save/persist product */
exports.postAddProduct = asyncMiddleware(async (req, res) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.user.id,
  });

  await product.save();

  res.redirect('/');
});

/* Get all products */
exports.getProducts = asyncMiddleware(async (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }

  const products = await Product.find({ userId: req.user._id });

  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
    editing: false,
    errorMessage: message,
  });
});

/* Render view for updating product */
exports.getEditProduct = asyncMiddleware(async (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect('/admin');

  /* Find product by primary key */
  const product = await Product.findById(req.params.productId);

  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: 'admin/edit-product',
    editing: editMode,
    product: product,
  });
});

/* Update existing product */
exports.postEditProduct = asyncMiddleware(async (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const { productId } = req.body;

  const productObject = {};
  if (title) productObject.title = title;
  if (imageUrl) productObject.imageUrl = imageUrl;
  if (price) productObject.price = price;
  if (description) productObject.description = description;

  let product = await Product.findById(objectId(productId));

  /* Check if product exist */
  if (!product) {
    return res.status(404).json({ msg: 'No Product Found' });
  }

  /* Check if product belongs to logged in user */
  if (product.userId.toString() !== req.user._id.toString()) {
    req.flash('error', 'You not authorized to edit this product');
    return res.status(401).redirect('/admin/products');
  }

  /* Update and save product */
  product = await Product.findByIdAndUpdate(
    productId,
    { $set: productObject },
    { new: true }
  );

  res.redirect('/admin/products');
});

/* Delete Product */
exports.deleteProduct = asyncMiddleware(async (req, res) => {
  const product = await Product.findById(req.body.productId);

  /* Check if product exists */
  if (!product) return res.status(400).json({ msg: 'Product not found' });

  /* Check if product belongs to user*/
  if (product.userId !== req.user._id) {
    req.flash('error', 'Your are not authorized to delete the product.');
    return res.status(401).redirect('/admin/products');
  }

  await Product.deleteOne({ _id: req.body.productId, userId: req.user._id });
  res.redirect('/admin/products');
});
