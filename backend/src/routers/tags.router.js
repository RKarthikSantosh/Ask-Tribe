const express = require('express');
const { tagsController } = require('../controllers');

const router = express.Router();

router.route('/')
  .get(tagsController.getTags);

router.route('/:tagname')
  .get(tagsController.getSingleTag);

module.exports = router;
