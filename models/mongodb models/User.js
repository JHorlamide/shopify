const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    maxLength: 255,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
    trim: true,
    required: true,
  },

  password: {
    type: String,
    minLength: 5,
    maxLength: 255,
    trim: true,
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

  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
    expiresIn: 3600,
  });

  return token;
};

/* User validation */
const validation = (userInput) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().lowercase('lower').email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    }),
    password: Joi.string().min(7).required().strict(),
    confirmPassword: Joi.ref('password'),
  });

  return schema.validate(userInput);
};

const User = mongoose.model('User', userSchema);

exports.validation = validation;
exports.User = User;
