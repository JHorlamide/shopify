const crypto = require('crypto');
const asyncMiddleware = require('../middleware/async');
const { User, validation } = require('../models/mongodb models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Joi = require('joi');

const inputValidation = (userInput) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(20).required(),
  });

  return schema.validate(userInput);
};

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'olamidejubril68@gmail.com',
    pass: '#JHorlamide21#',
  },
});

/* Render view for signing up */
exports.getSignUp = asyncMiddleware(async (req, res) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
});

/* Sign up user */
exports.postSignUp = asyncMiddleware(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const { error } = validation({ name, email, password });
  if (error) {
    req.flash('error', error.details[0].message);
    return res.status(400).redirect('/signup');
  }

  /* Check if user exist */
  let user = await User.findOne({ email: email });
  if (user) {
    req.flash('error', 'User already exist');
    return res.status(400).redirect('/signup');
  }

  /* Confirm Password Match */
  if (password !== confirmPassword) {
    req.flash('error', 'Password do not match');
    return res.status(400).redirect('/signup');
  }

  /* Create new user if user does not exist */
  user = new User({ name, email, password, cart: { items: [] } });

  /* hash user password */
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);

  /* save user */
  await user.save();

  res.redirect('/login');

  // send mail with defined transport object
  let info = await transporter.sendMail({
    to: email,
    from: 'olamide_jubril@outlook',
    subject: 'Sending email from Node for the very first time',
    html: '<h1>Hello! it fun sending my first mail with nodemailer</h1>',
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});

/* Render view for logging in User */
exports.getLogin = asyncMiddleware(async (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
});

/* Login User */
exports.postLogin = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  /* Validate user input */
  const { error } = inputValidation({ email, password });
  if (error) {
    req.flash('error', error.details[0].message);
    return res.status(400).redirect('/login');
  }

  /* Check if user exist */
  const user = await User.findOne({ email: email });
  if (!user) {
    req.flash('error', 'Invalid email or password');
    return res.status(400).redirect('/login');
  }

  /* Validate password */
  const validatePassword = await bcrypt.compare(password, user.password);
  if (!validatePassword) {
    req.flash('error', 'Invalid email or password');
    return res.status(400).redirect('/login');
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  req.session.save((err) => {
    if (err) {
      return console.log(err);
    }

    res.redirect('/');
  });
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

/* Render view for  Resetting password */
exports.getReset = asyncMiddleware(async (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }

  res.render('auth/pass_reset', {
    path: '/pass_reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
});

/* Reset Password */
exports.postReset = asyncMiddleware(async (req, res) => {
  crypto.randomBytes(32, async (error, buffer) => {
    if (error) {
      req.flash('error', 'Error generating buffer');
      return res.status(400).redirect('/pass-reset');
    }

    const token = buffer.toString('hex');

    /* Find user with the email address */
    const user = await User.findOne({ email: req.body.email });

    /* Check if user exist */
    if (!user) {
      req.flash('error', 'No user with this email address.');
      return res.status(400).redirect('/login');
    }

    /* Store token in the database */
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    user.save();

    res.redirect('/');

    // send mail with defined transport object
    let info = await transporter.sendMail({
      to: req.body.email,
      from: 'shopify@businessmail.com',
      subject: 'Password reset',
      html: `
      <p>Hello ${
        user.name.split(' ')[0]
      } Did your request for a password reset? if so find the link to reset your password.</p>
      <p>Click this <a href='http://localhost:5000/new-password/${token}'><strong>link</strong></a> to reset your password.</p>
      `,
    });

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
});

/* Render view for resetting password */
exports.getNewPassword = asyncMiddleware(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  let message = req.flash('error');
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }

  if (user) {
    res.render('auth/new_password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  }
});

/* Update password */
exports.postNewPassword = asyncMiddleware(async (req, res) => {
  const { password, confirmPassword, userId, passwordToken } = req.body;

  const user = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });

  if (!user) {
    req.flash('error', 'User credential not valid');
    return res.status(400).redirect('/new-password/:token');
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Your password do not match');
    return res.status(400).redirect('/new-password/:token');
  }

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(password, salt);
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  user.save();
  res.redirect('/login');
});
