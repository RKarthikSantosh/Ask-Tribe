const { responseHandler } = require('../helpers');
const { CommunitiesRepository, UsersRepository } = require('../repositories');

exports.retrieveAll = async (userId, result) => {
  try {
    const data = await CommunitiesRepository.listCommunities(userId);
    return result(null, responseHandler(true, 200, 'Success', data));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.create = async ({ name, description, creatorId }, result) => {
  try {
    const community = await CommunitiesRepository.createCommunity({
      name,
      description,
      creatorId,
    });

    await CommunitiesRepository.addMember({
      communityId: community.id,
      userId: creatorId,
    });

    return result(null, responseHandler(true, 201, 'Community created', community));
  } catch (error) {
    console.log(error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return result(responseHandler(false, 400, 'Community name already exists', null), null);
    }

    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.addMember = async ({ communityId, userId, requesterId }, result) => {
  try {
    const community = await CommunitiesRepository.findCommunityById(communityId);
    if (!community) {
      return result(responseHandler(false, 404, 'Community not found', null), null);
    }

    const requesterMembership = await CommunitiesRepository.isCommunityMember({
      communityId,
      userId: requesterId,
    });

    if (!requesterMembership) {
      return result(responseHandler(false, 403, 'Only community members can add users', null), null);
    }

    const targetUser = await UsersRepository.retrieveOne({ id: userId });
    if (!targetUser) {
      return result(responseHandler(false, 404, 'User not found', null), null);
    }

    const [, created] = await CommunitiesRepository.addMember({ communityId, userId });

    return result(
      null,
      responseHandler(true, 200, created ? 'User added to community' : 'User already in community', null),
    );
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.retrieveMembers = async (communityId, requesterId, result) => {
  try {
    const community = await CommunitiesRepository.findCommunityById(communityId);
    if (!community) {
      return result(responseHandler(false, 404, 'Community not found', null), null);
    }

    const membership = await CommunitiesRepository.isCommunityMember({
      communityId,
      userId: requesterId,
    });

    if (!membership) {
      return result(responseHandler(false, 403, 'Only community members can view this', null), null);
    }

    const members = await CommunitiesRepository.listMembers(communityId);
    return result(null, responseHandler(true, 200, 'Success', members));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.createQuestion = async ({ communityId, userId, title, body }, result) => {
  try {
    const community = await CommunitiesRepository.findCommunityById(communityId);
    if (!community) {
      return result(responseHandler(false, 404, 'Community not found', null), null);
    }

    const membership = await CommunitiesRepository.isCommunityMember({ communityId, userId });
    if (!membership) {
      return result(responseHandler(false, 403, 'Only community members can post questions', null), null);
    }

    const question = await CommunitiesRepository.createQuestion({
      communityId,
      userId,
      title,
      body,
    });

    return result(null, responseHandler(true, 201, 'Community question created', question));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.retrieveQuestions = async (communityId, requesterId, result) => {
  try {
    const community = await CommunitiesRepository.findCommunityById(communityId);
    if (!community) {
      return result(responseHandler(false, 404, 'Community not found', null), null);
    }

    const membership = await CommunitiesRepository.isCommunityMember({
      communityId,
      userId: requesterId,
    });

    if (!membership) {
      return result(responseHandler(false, 403, 'Only community members can view this', null), null);
    }

    const questions = await CommunitiesRepository.listQuestions(communityId);
    return result(null, responseHandler(true, 200, 'Success', questions));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.addQuestionAnswer = async ({ questionId, userId, body }, result) => {
  try {
    const question = await CommunitiesRepository.findQuestionById(questionId);
    if (!question) {
      return result(responseHandler(false, 404, 'Community question not found', null), null);
    }

    const membership = await CommunitiesRepository.isCommunityMember({
      communityId: question.community_id,
      userId,
    });

    if (!membership) {
      return result(responseHandler(false, 403, 'Only community members can answer', null), null);
    }

    const answer = await CommunitiesRepository.createQuestionAnswer({
      questionId,
      userId,
      body,
    });

    return result(null, responseHandler(true, 201, 'Community answer added', answer));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.retrieveQuestionAnswers = async (questionId, requesterId, result) => {
  try {
    const question = await CommunitiesRepository.findQuestionById(questionId);
    if (!question) {
      return result(responseHandler(false, 404, 'Community question not found', null), null);
    }

    const membership = await CommunitiesRepository.isCommunityMember({
      communityId: question.community_id,
      userId: requesterId,
    });

    if (!membership) {
      return result(responseHandler(false, 403, 'Only community members can view this', null), null);
    }

    const answers = await CommunitiesRepository.listQuestionAnswers(questionId);
    return result(null, responseHandler(true, 200, 'Success', answers));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.addQuestionComment = async ({ questionId, userId, body }, result) => {
  try {
    const question = await CommunitiesRepository.findQuestionById(questionId);
    if (!question) {
      return result(responseHandler(false, 404, 'Community question not found', null), null);
    }

    const membership = await CommunitiesRepository.isCommunityMember({
      communityId: question.community_id,
      userId,
    });

    if (!membership) {
      return result(responseHandler(false, 403, 'Only community members can comment', null), null);
    }

    const comment = await CommunitiesRepository.createQuestionComment({
      questionId,
      userId,
      body,
    });

    return result(null, responseHandler(true, 201, 'Community comment added', comment));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};

exports.retrieveQuestionComments = async (questionId, requesterId, result) => {
  try {
    const question = await CommunitiesRepository.findQuestionById(questionId);
    if (!question) {
      return result(responseHandler(false, 404, 'Community question not found', null), null);
    }

    const membership = await CommunitiesRepository.isCommunityMember({
      communityId: question.community_id,
      userId: requesterId,
    });

    if (!membership) {
      return result(responseHandler(false, 403, 'Only community members can view this', null), null);
    }

    const comments = await CommunitiesRepository.listQuestionComments(questionId);
    return result(null, responseHandler(true, 200, 'Success', comments));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};
exports.retrieveQuestion = async (questionId, requesterId, result) => {
  try {
    const question = await CommunitiesRepository.findQuestionById(questionId);
    if (!question) {
      return result(responseHandler(false, 404, 'Community question not found', null), null);
    }

    const membership = await CommunitiesRepository.isCommunityMember({
      communityId: question.community_id,
      userId: requesterId,
    });

    if (!membership) {
      return result(responseHandler(false, 403, 'Only community members can view this', null), null);
    }

    return result(null, responseHandler(true, 200, 'Success', question));
  } catch (error) {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong', null), null);
  }
};
