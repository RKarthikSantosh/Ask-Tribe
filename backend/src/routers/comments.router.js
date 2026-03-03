const express = require('express');
const { check } = require('express-validator');
const { auth, checkOwnership } = require('../middleware');
const { commentsController } = require('../controllers');

const router = express.Router();

router.route('/:id')
  .get(commentsController.getComments);

router.route('/:id')
  .post(
    auth,
    check('body', 'Comment is required').not().isEmpty(),
    commentsController.addComment,
  );

router.route('/:id')
  .delete(
    auth,
    checkOwnership,
    commentsController.deleteComment,
  );

module.exports = router;
