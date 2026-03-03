const express = require('express');
const { check } = require('express-validator');
const { auth } = require('../middleware');
const { authController } = require('../controllers');

const router = express.Router();

router.route('/')
  .get(
    auth,
    authController.loadUser,
  );

router.route('/')
  .post(
    check('username', 'Please include a valid username').isLength({ min: 5 }),
    check('password', 'Password is required').not().isEmpty(),
    authController.login,
  );

module.exports = router;
