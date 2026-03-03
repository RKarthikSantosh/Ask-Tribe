const express = require('express');
const { check } = require('express-validator');
const { checkExistence } = require('../middleware');
const { usersController } = require('../controllers');

const router = express.Router();

router.route('/')
  .get(usersController.getAllUsers);

router.route('/:id')
  .get(usersController.getOneUser);

router.route('/')
  .post(
    check('username', 'Please include a valid username').isLength({ min: 5 }),
    check('password', 'Please enter a password with 5 or more characters').isLength({ min: 5 }),
    checkExistence,
    usersController.register,
  );

module.exports = router;
