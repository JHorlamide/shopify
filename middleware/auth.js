const auth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/auth/login');
  }

  next();
};

module.exports = auth;
