const { responseHandler, asyncHandler } = require('../helpers');
const { communitiesService } = require('../services');

exports.getCommunities = asyncHandler(async (req, res) => {
  try {
    await communitiesService.retrieveAll(req.user.id, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.createCommunity = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json(responseHandler(false, 400, 'Name and description are required', null));
    }

    await communitiesService.create({
      name: name.trim(),
      description: description.trim(),
      creatorId: req.user.id,
    }, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.addMember = asyncHandler(async (req, res) => {
  try {
    const { id: communityId } = req.params;
    const userId = req.body.userId || req.user.id;

    await communitiesService.addMember({
      communityId,
      userId,
      requesterId: req.user.id,
    }, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.getMembers = asyncHandler(async (req, res) => {
  try {
    await communitiesService.retrieveMembers(req.params.id, req.user.id, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.createQuestion = asyncHandler(async (req, res) => {
  try {
    const { title, body } = req.body;
    const { id: communityId } = req.params;

    if (!title || !body) {
      return res.status(400).json(responseHandler(false, 400, 'Title and body are required', null));
    }

    await communitiesService.createQuestion({
      communityId,
      userId: req.user.id,
      title: title.trim(),
      body: body.trim(),
    }, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.getQuestions = asyncHandler(async (req, res) => {
  try {
    await communitiesService.retrieveQuestions(req.params.id, req.user.id, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.addQuestionAnswer = asyncHandler(async (req, res) => {
  try {
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json(responseHandler(false, 400, 'Answer is required', null));
    }

    await communitiesService.addQuestionAnswer({
      questionId: req.params.id,
      userId: req.user.id,
      body: body.trim(),
    }, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.getQuestionAnswers = asyncHandler(async (req, res) => {
  try {
    await communitiesService.retrieveQuestionAnswers(req.params.id, req.user.id, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.addQuestionComment = asyncHandler(async (req, res) => {
  try {
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json(responseHandler(false, 400, 'Comment is required', null));
    }

    await communitiesService.addQuestionComment({
      questionId: req.params.id,
      userId: req.user.id,
      body: body.trim(),
    }, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.getQuestionComments = asyncHandler(async (req, res) => {
  try {
    await communitiesService.retrieveQuestionComments(req.params.id, req.user.id, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});
exports.getQuestion = asyncHandler(async (req, res) => {
  try {
    await communitiesService.retrieveQuestion(req.params.id, req.user.id, (err, data) => {
      if (err) {
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler(false, 500, 'Server Error', null));
  }
});
