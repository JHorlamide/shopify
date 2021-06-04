/* Custom modules */
const asyncMiddleware = require('../middleware/async');
const Product = require('../models/mongodb models/Product');
// const { User } = require('../models/mongodb models/User');
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
  const products = await Product.find();

  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
    editing: false,
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

  if (!product) return res.status(400).json({ msg: 'Product not found' });

  await Product.findByIdAndRemove(req.body.productId);
  res.redirect('/admin/products');
});