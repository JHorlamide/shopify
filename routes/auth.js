const express = require('express');
const router = express.Router();

const {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  postLogout,
} = require('../controllers/auth');

/***
 * @router  GET: /auth/signup
 * @desc    Render view for signing up
 * @access  Public
 * ***/
router.get('/signup', getSignUp);

/***
 * @router  POST: /auth/signup
 * @desc    Signup user
 * @access  Public
 * ***/
router.post('/signup', postSignUp);

/***
 * @router  GET: /auth/login
 * @desc    Render view for login
 * @access  Public
 * ***/
router.get('/login', getLogin);

/***
 * @router  POST: /auth/login
 * @desc    Authenticate user/login user
 * @access  Public
 * ***/
router.post('/login', postLogin);

/***
 * @router  POST: /auth/logout
 * @desc    Authenticate user/logout user
 * @access  Public
 * ***/
router.post('/logout', postLogout);

module.exports = router;
