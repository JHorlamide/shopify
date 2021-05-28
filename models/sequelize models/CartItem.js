const { DataTypes } = require('sequelize');
const sequelize = require('../src/sequelize_db_config/database');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  quantity: {
    type: DataTypes.INTEGER,
  },
});

module.exports = CartItem;
