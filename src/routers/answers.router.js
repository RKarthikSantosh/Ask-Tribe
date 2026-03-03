const express = require('express');
const { check } = require('express-validator');
const { auth, checkOwnership } = require('../middleware');
const { answersController } = require('../controllers');

const router = express.Router();

router.route('/:id')
  .get(answersController.getAnswers);

router.route('/:id')
  .post(
    auth,
    check('text', 'Answer is required').not().isEmpty(),
    answersController.addAnswer,
  );

router.route('/:id')
  .delete(
    auth,
    checkOwnership,
    answersController.deleteAnswer,
  );

module.exports = router;
