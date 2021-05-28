const { DataTypes } = require('sequelize');
const sequelize = require('../src/sequelize_db_config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Order;
