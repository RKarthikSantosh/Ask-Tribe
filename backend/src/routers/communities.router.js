const express = require('express');
const { auth } = require('../middleware');
const { communitiesController } = require('../controllers');

const router = express.Router();

router.route('/')
  .get(auth, communitiesController.getCommunities)
  .post(auth, communitiesController.createCommunity);

router.route('/:id/members')
  .get(auth, communitiesController.getMembers)
  .post(auth, communitiesController.addMember);

router.route('/:id/questions')
  .get(auth, communitiesController.getQuestions)
  .post(auth, communitiesController.createQuestion);

router.route('/questions/:id')
  .get(auth, communitiesController.getQuestion);

router.route('/questions/:id/answers')
  .get(auth, communitiesController.getQuestionAnswers)
  .post(auth, communitiesController.addQuestionAnswer);

router.route('/questions/:id/comments')
  .get(auth, communitiesController.getQuestionComments)
  .post(auth, communitiesController.addQuestionComment);

module.exports = router;
