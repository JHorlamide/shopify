const auth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  next();
};

module.exports = auth;
