const { DataTypes } = require('sequelize');

const sequelize = require('../src/sequelize_db_config/database');

const OrderItem = sequelize.define('OrderItem', {
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

module.exports = OrderItem;
