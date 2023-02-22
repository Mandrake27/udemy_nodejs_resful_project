const { body, validationResult } = require('express-validator');
const User = require('../models/user');

const requirementsArr = [
  body('email', 'Please enter a valid email')
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value.email })
        .then(user => {
          if (user) {
            return Promise.reject('Email address already exists.');
          }
        });
    }).normalizeEmail(),
  body('password', 'Please enter a valid password')
    .trim().isLength({ min: 5 }),
  body('name')
    .trim().not().isEmpty(),
]

const authValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
  }
  next();
}

module.exports = {
  requirementsArr,
  authValidation,
}