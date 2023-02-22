const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middlewares/isAuth');
const userStatusValidator = require('../middlewares/user-status-validator');
const userStatusController = require('../controllers/user-status');

const router = express.Router();

router.get('/status', isAuth, userStatusController.getUserStatus);

router.put('/status', [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  isAuth,
  userStatusValidator,
  userStatusController.updateUserStatus
);

module.exports = router;