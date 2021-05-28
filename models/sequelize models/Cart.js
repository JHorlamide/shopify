const { DataTypes } = require('sequelize');
const sequelize = require('../../src/sequelize_db_config/database');

/* Custom Models */
const CartItem = require('./CartItem');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
