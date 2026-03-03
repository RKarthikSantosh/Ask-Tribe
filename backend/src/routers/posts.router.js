const express = require('express');
const { check } = require('express-validator');
const { auth, checkOwnership } = require('../middleware');
const { postsController } = require('../controllers');

const router = express.Router();

router.route('/')
  .get(postsController.getPosts);

router.route('/tag/:tagname')
  .get(postsController.getTagPosts);

router.route('/:id')
  .get(postsController.getSinglePost);

router.route('/')
  .post(
    auth,
    check('title', 'Enter a title with minimum 15 characters').isLength({ min: 15 }),
    check('body', 'Enter a body with minimum 30 characters').isLength({ min: 30 }),
    postsController.addPost,
  );

router.route('/:id')
  .delete(
    auth,
    checkOwnership,
    postsController.deletePost,
  );

module.exports = router;
