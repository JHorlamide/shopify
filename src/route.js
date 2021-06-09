const express = require('express');
const path = require('path');
const csrf = require('csurf');
const config = require('config');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
const flashErrorMessage = require('connect-flash');

/* Routes */
const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const authRoute = require('../routes/auth');
const { User } = require('../models/mongodb models/User');

/* Middlewares */
const userMiddleware = require('../middleware/userMiddleware');

/* Error handling controller */
const errorController = require('../controllers/error');

const routes = (app) => {
  /* Session store config */
  const store = new MongoDBStore({
    uri: config.get('MONGODB_URI'),
    collection: 'sessions',
  });

  /* Set view engin */
  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    session({
      secret: 'secret123',
      resave: false,
      store: store,
      saveUninitialized: false,
    })
  );

  /* CSRF Protection */
  app.use(csrf());

  /* Register connect-flash */
  app.use(flashErrorMessage());

  app.use(express.static(path.join(__dirname, '../public')));

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
  app.use(shopRoutes);
  app.use(authRoute);

  /* Handles unknown route */
  app.use(errorController.get404);
};

module.exports = routes;
