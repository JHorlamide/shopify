const express = require("express");
const router = express.Router();

const {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");

/***
 * @router  GET: /signup
 * @desc    Render view for signing up
 * @access  Public
 * ***/
router.get("/signup", getSignUp);

/***
 * @router  POST: /signup
 * @desc    Signup user
 * @access  Public
 * ***/
router.post("/signup", postSignUp);

/***
 * @router  GET: /login
 * @desc    Render view for login
 * @access  Public
 * ***/
router.get("/login", getLogin);

/***
 * @router  POST: /login
 * @desc    Authenticate user/login user
 * @access  Public
 * ***/
router.post("/login", postLogin);

/***
 * @router  POST: /logout
 * @desc    Authenticate user/logout user
 * @access  Public
 * ***/
router.post("/logout", postLogout);

/***
 * @router  GET: /pass-reset
 * @desc    Render view for password reset
 * @access  Public
 * ***/
router.get("/pass-reset", getReset);

/***
 * @router  POST: /pass-reset
 * @desc    Reset password
 * @access  Public
 * ***/
router.post("/pass-reset", postReset);

/***
 * @router  GET: /new-password
 * @desc    Render view for new password
 * @access  Public
 * ***/
router.get("/new-password/:token", getNewPassword);

/***
 * @router  POST: /new-password
 * @desc    Render view for new password
 * @access  Public
 * ***/
router.post("/new-password", postNewPassword);

module.exports = router;
