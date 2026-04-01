const Sequelize = require('sequelize');
const {
  CommunitiesModel,
  CommunityMembersModel,
  CommunityQuestionsModel,
  CommunityQuestionAnswersModel,
  CommunityQuestionCommentsModel,
  UsersModel,
} = require('../models');

exports.createCommunity = async ({ name, description, creatorId }) => CommunitiesModel.create({
  name,
  description,
  creator_id: creatorId,
});

exports.findCommunityById = async (communityId) => CommunitiesModel.findOne({
  where: { id: communityId },
});

exports.isCommunityMember = async ({ communityId, userId }) => CommunityMembersModel.findOne({
  where: {
    community_id: communityId,
    user_id: userId,
  },
});

exports.listCommunities = async (userId) => {
  const items = await CommunitiesModel.findAll({
    attributes: [
      'id',
      'name',
      'description',
      'creator_id',
      'created_at',
      [Sequelize.literal('creator.username'), 'creator_username'],
      [
        Sequelize.literal('(SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = communities.id)'),
        'members_count',
      ],
      [
        Sequelize.literal('(SELECT COUNT(*) FROM community_questions cq WHERE cq.community_id = communities.id)'),
        'questions_count',
      ],
    ],
    include: [
      {
        model: UsersModel,
        as: 'creator',
        attributes: [],
        required: false,
      },
      {
        model: CommunityMembersModel,
        as: 'members',
        attributes: [],
        required: true,
        where: {
          user_id: userId,
        },
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return items.map((item) => item.get({ plain: true }));
};

exports.addMember = async ({ communityId, userId }) => CommunityMembersModel.findOrCreate({
  where: {
    community_id: communityId,
    user_id: userId,
  },
  defaults: {
    community_id: communityId,
    user_id: userId,
  },
});

exports.listMembers = async (communityId) => {
  const items = await CommunityMembersModel.findAll({
    where: { community_id: communityId },
    attributes: ['id', 'community_id', 'user_id', 'created_at'],
    include: [
      {
        model: UsersModel,
        attributes: ['id', 'username', 'gravatar'],
        required: false,
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return items.map((item) => item.get({ plain: true }));
};

exports.createQuestion = async ({ communityId, userId, title, body }) => CommunityQuestionsModel.create({
  community_id: communityId,
  user_id: userId,
  title,
  body,
});

exports.listQuestions = async (communityId) => {
  const items = await CommunityQuestionsModel.findAll({
    where: { community_id: communityId },
    attributes: ['id', 'community_id', 'user_id', 'title', 'body', 'created_at'],
    include: [
      {
        model: UsersModel,
        attributes: ['id', 'username', 'gravatar'],
        required: false,
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return items.map((item) => item.get({ plain: true }));
};

exports.findQuestionById = async (questionId) => {
  const item = await CommunityQuestionsModel.findOne({
    where: { id: questionId },
    include: [
      {
        model: UsersModel,
        attributes: ['id', 'username', 'gravatar'],
        required: false,
      },
    ],
  });
  return item ? item.get({ plain: true }) : null;
};

exports.createQuestionAnswer = async ({ questionId, userId, body }) => CommunityQuestionAnswersModel.create({
  community_question_id: questionId,
  user_id: userId,
  body,
});

exports.listQuestionAnswers = async (questionId) => {
  const items = await CommunityQuestionAnswersModel.findAll({
    where: { community_question_id: questionId },
    attributes: ['id', 'community_question_id', 'user_id', 'body', 'created_at'],
    include: [
      {
        model: UsersModel,
        attributes: ['id', 'username', 'gravatar'],
        required: false,
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return items.map((item) => item.get({ plain: true }));
};

exports.createQuestionComment = async ({ questionId, userId, body }) => CommunityQuestionCommentsModel.create({
  community_question_id: questionId,
  user_id: userId,
  body,
});

exports.listQuestionComments = async (questionId) => {
  const items = await CommunityQuestionCommentsModel.findAll({
    where: { community_question_id: questionId },
    attributes: ['id', 'community_question_id', 'user_id', 'body', 'created_at'],
    include: [
      {
        model: UsersModel,
        attributes: ['id', 'username', 'gravatar'],
        required: false,
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return items.map((item) => item.get({ plain: true }));
};
