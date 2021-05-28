const { User } = require('../models/mongodb models/User');

const userMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById('60ad2b7064de4e12580e413a');
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = userMiddleware;
