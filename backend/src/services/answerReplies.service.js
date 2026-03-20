const { responseHandler } = require('../helpers');
const { AnswerRepliesRepository, AnswersRepository } = require('../repositories');
const aiService = require('./ai.service');

exports.create = async (newReply, result) => {
  await AnswerRepliesRepository.create(newReply, async (err, data) => {
    if (err) {
      return result(err, null);
    }

    try {
      const answer = await AnswersRepository.findById(newReply.answerId);
      const answerUsername = answer?.get ? answer.get('username') : answer?.username;
      const answerUserId = answer?.get ? answer.get('user_id') : answer?.user_id;
      const aiAssistantNames = ['ramineni_ai', 'eswar_ai'];

      if (answer && aiAssistantNames.includes(answerUsername) && newReply.userId !== answerUserId) {
        await aiService.createAssistantReplyForAnswer({
          answerId: newReply.answerId,
          replyBody: newReply.body,
          answerBody: answer?.get ? answer.get('body') : answer?.body,
          assistantUsername: answerUsername,
        });
      }
    } catch (error) {
      console.log('AI follow-up reply failed:', error.message);
    }

    return result(null, data);
  });
};

exports.retrieveAll = async (answerId, result) => {
  const answer = await AnswersRepository.findById(answerId);
  if (!answer) {
    return result(responseHandler(false, 404, 'Answer not found', null), null);
  }

  return AnswerRepliesRepository.retrieveAll(answerId, result);
};
