const { validationResult } = require('express-validator');
const { responseHandler, asyncHandler } = require('../helpers');
const { postsService } = require('../services');

const Post = (post) => ({
  title: post.title,
  body: post.body,
  userId: post.userId,
  tagName: post.tagName,
  askAi: post.askAi,
  aiAssistant: post.aiAssistant,
});

exports.getPosts = asyncHandler(async (req, res) => {
  try {
    await postsService.retrieveAll((err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.code).json(err);
      }

      return res.status(data.code).json(data);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(true, 500, 'Server Error', null));
  }
});

exports.getTagPosts = asyncHandler(async (req, res) => {
  const tagName = req.params.tagname;

  try {
    await postsService.retrieveAllTag(
      tagName,
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(err.code).json(err);
        }
        return res.status(data.code).json(data);
      },
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(true, 500, 'Server Error', null));
  }
});

exports.getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    await postsService.retrieveUserPosts(
      userId,
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(err.code).json(err);
        }
        return res.status(data.code).json(data);
      },
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(true, 500, 'Server Error', null));
  }
});

exports.getSinglePost = asyncHandler(async (req, res) => {
  try {
    await postsService.retrieveOne(req.params.id, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.addPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(responseHandler(false, 400, errors.array()[0].msg, null));
  }
  try {
    const askAiEnabled = req.body.askAi === true || req.body.ask_ai === true
      || req.body.askAi === 'true' || req.body.ask_ai === 'true';
    const selectedAssistant = req.body.aiAssistant === 'eswar_ai' ? 'eswar_ai' : 'ramineni_ai';

    const post = Post({
      title: req.body.title,
      body: req.body.body,
      userId: req.user.id,
      tagName: req.body.tagname,
      askAi: askAiEnabled,
      aiAssistant: selectedAssistant,
    });
    // Save Post in the database
    await postsService.create(post, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.deletePost = asyncHandler(async (req, res) => {
  try {
    await postsService.remove(req.params.id, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});
