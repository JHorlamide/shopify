const { DataTypes } = require('sequelize');
const sequelize = require('../src/sequelize_db_config/database');

/* Model */
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

User.hasOne(Cart);
Cart.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

module.exports = User;
