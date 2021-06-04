const express = require('express');
const path = require('path');
const csrf = require('csurf');
const config = require('config');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);

/* Routes */
const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const authRoute = require('../routes/auth');

/* Middlewares */
const userMiddleware = require('../middleware/userMiddleware');

/* Error handling controller */
const errorController = require('../controllers/error');

const routes = (app) => {
  /* Session store config */
  const store = new mongodbStore({
    uri: config.get('MONGODB_URI'),
    collection: 'sessions',
  });

  /* Set view engin */
  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: 'secret123',
      resave: false,
      store: store,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 360000,
      },
    })
  );

  /* CSRF Protection */
  app.use(csrf());

  /* User middleware */ 
  app.use(async (req, res, next) => {
    if (!req.session.user) {
      return next();
    }

    try {
      const user = await User.findById(req.session.user._id);
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
    }
  });

  /* Local variables */ 
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  /* Routes */
  app.use('/admin', adminRoutes);
  app.use('/auth', authRoute);
  app.use(shopRoutes);

  /* Handles unknown route */
  app.use(errorController.get404);
};

module.exports = routes;