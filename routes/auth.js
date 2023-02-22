const express = require('express');

const { requirementsArr, authValidation } = require('../middlewares/auth-validation');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', ...requirementsArr, authValidation, authController.signup);

router.post('/login', authController.login);

module.exports = router;