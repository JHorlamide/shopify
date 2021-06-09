const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    maxLength: 255,
    required: true,
  },

  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    minLength: 5,
    maxLength: 255,
    required: true,
  },

  resetToken: {
    type: String,
  },

  resetTokenExpiration: {
    type: Date,
  },

  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

/* Created Cart */
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
    return cartProduct.productId.toString() === product.id.toString();
  });

  let newQuantity = 1;

  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product.id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

/* Delete cart */
userSchema.methods.deleteCart = function (product) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== product.id.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

/* Clear cart */
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

/* JsonWebToken */
userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this.id,
  };

  const token = jwt.sign(payload, config.get('JwtPrivateKey'), {
    expiresIn: 3600,
  });

  return token;
};

/* User validation */
exports.validateInput = (userInput) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(20).required(),
  });

  return schema.validate(userInput);
};

const validation = (userInput) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(20).required(),
  });

  return schema.validate(userInput);
};

const User = mongoose.model('User', userSchema);

exports.validation = validation;
exports.User = User;
