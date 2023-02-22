const { body, validationResult } = require('express-validator');

const requirementsArr = [
  body('title', 'Please enter a valid title')
    .trim().escape().isLength({ min: 5 }),
  body('content', 'Please enter a valid content')
    .trim().escape().isLength({ min: 5 }),
]

const postValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    next(error);
  }
  next();
}

module.exports = {
  requirementsArr,
  postValidation,
}