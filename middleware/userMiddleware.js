const { User } = require('../models/mongodb models/User');

const userMiddleware = async (req, res, next) => {
  if(!req.session.user) {
    return next();
  }

  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = userMiddleware;
