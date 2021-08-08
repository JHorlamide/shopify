const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 5,
    maxLength: 255,
    trim: true,
    required: true,
  },

  price: {
    type: Number,
    trim: true,
    required: true,
  },

  imageUrl: {
    type: String,
    minLength: 5,
    maxLength: 255,
    trim: true,
    required: true,
  },

  description: {
    type: String,
    minLength: 5,
    maxLength: 400,
    trim: true,
    // required: true,
  },

  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

const validation = (input) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    price: Joi.number().required(),
    imageUrl: Joi.string().uri().required(),
    description: Joi.string().min(5).max(400).required(),
  });

  return schema.validate(input);
};

const Product = mongoose.model('Product', productSchema);

exports.validation = validation;
exports.Product = Product;
