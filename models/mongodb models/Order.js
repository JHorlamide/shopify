const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  user: {
    name: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
