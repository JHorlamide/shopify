const asyncMiddleware = require('../middleware/async');
const { Product, validation } = require('../models/mongodb models/Product');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

/* Renders view for adding product */
exports.getAddProduct = asyncMiddleware(async (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    validationError: null,
    errorMessage: null,
    oldInput: { title: '', imageUrl: '', price: '', description: '' },
  });
});

/* Save product */
exports.postAddProduct = asyncMiddleware(async (req, res) => {
  const { title, imageUrl, price, description } = req.body;

  const { error } = validation({ title, imageUrl, price, description });
  if (error) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: error.details[0].message,
      validationError: error.details[0].path[0],
      oldInput: { title, imageUrl, price, description },
    });
  }

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

  return res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
    errorMessage: message,
  });
});

/* Render view for updating product */
exports.getEditProduct = asyncMiddleware(async (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect('/admin');

  console.log('Product Id - 1 (Render view)', req.params.productId);

  /* Find product */
  const product = await Product.findById(req.params.productId);

  console.log('Product Id - 2 (Render view)', req.params.productId);

  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: 'admin/edit-product',
    editing: editMode,
    hasError: false,
    product: product,
    errorMessage: null,
    validationError: null,
  });
});

/* Update existing product */
exports.postEditProduct = asyncMiddleware(async (req, res) => {
  const { title, imageUrl, price, description, productId } = req.body;

  console.log('Product Id - 1 (Post)', productId);

  const { error } = validation({ title, imageUrl, price, description });
  if (error) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      validationError: error.details[0].path[0],
      errorMessage: error.details[0].message,
      product: { title, imageUrl, price, description, productId },
    });
  }

  const productObject = {};
  if (title) productObject.title = title;
  if (imageUrl) productObject.imageUrl = imageUrl;
  if (price) productObject.price = price;
  if (description) productObject.description = description;

  console.log('Product Id - 2 (Post)', productId);

  let product = await Product.findById(productId);

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
