const express = require('express');
const session = require('express-session');
const path = require('path');
const config = require('config');
const csrf = require('csurf');
const mongodbStore = require('connect-mongodb-session')(session);

/* Routes */
const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const authRoute = require('../routes/auth');

/* Middlewares */
const userMiddleware = require('../middleware/userMiddleware');
const errorController = require('../controllers/error');

/* Session store config */
const store = new mongodbStore({
  uri: config.get('MONGODB_URI'),
  collection: 'sessions',
});

/* CSRF Protection */
const csrfProtection = csrf({ cookie: false });

const routes = (app) => {
  /* Set view engin */
  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(
    session({
      secret: 'mySecrete',
      resave: false,
      store: store,
      saveUninitialized: false,
    })
  );

  app.use(csrfProtection);
  app.use(userMiddleware);
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
