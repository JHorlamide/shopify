const asyncMiddleware = require('../middleware/async');
const { User, validation } = require('../models/mongodb models/User');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const inputValidation = (userInput) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(20).required(),
  });

  return schema.validate(userInput);
};

/* Render view for signing up */
exports.getSignUp = asyncMiddleware(async (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  });
});

/* Sign up user */
exports.postSignUp = asyncMiddleware(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const { error } = validation({ name, email, password });
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  /* Check if user exist */
  let user = await User.findOne({ email: email });
  if (user) return res.status(400).json({ msg: 'User already exist' });

  /* Validate Password */
  if (password !== confirmPassword)
    return res.status(400).json({ msg: 'Invalid credential' });

  /* Create new user if user does not exist */
  user = new User({ name, email, password, cart: { items: [] } });

  /* hash user password */
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  /* save user */
  await user.save();
  token = user.generateAuthToken();
  console.log(token);
  res.redirect('/');
});

/* Render view for logging in User */
exports.getLogin = asyncMiddleware(async (req, res) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
  });
});

/* Login User */
exports.postLogin = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  /* Validate user input */
  const { error } = inputValidation({ email, password });
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  /* Check if user exist */
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).redirect('/auth/login');
  }

  /* Validate password */
  const validatePassword = await bcrypt.compare(password, user.password);
  if (!validatePassword) {
    return res.status(400).redirect('/auth/login');
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  req.session.save((err) => {
    if (err) {
      return console.log(err);
    }

    res.redirect('/');
  });

  const token = user.generateAuthToken();

  console.log(token);
});

/* Logout User */
exports.postLogout = asyncMiddleware(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }

    res.redirect('/');
  });
});
