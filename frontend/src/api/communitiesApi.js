import axios from 'axios';

import {
  communitiesData as _communitiesData,
  communityMembersData as _communityMembersData,
  communityQuestionsData as _communityQuestionsData,
  communitySingleQuestionData as _communitySingleQuestionData,
  communityQuestionAnswersData as _communityQuestionAnswersData,
  communityQuestionCommentsData as _communityQuestionCommentsData,
} from './urls';

export const getCommunities = () => axios.get(_communitiesData);

export const createCommunity = (payload) => axios.post(_communitiesData, payload, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCommunityMembers = (communityId) => axios.get(
  _communityMembersData.replace('{id}', communityId),
);

export const addCommunityMember = (communityId, payload) => axios.post(
  _communityMembersData.replace('{id}', communityId),
  payload,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);

export const getCommunityQuestions = (communityId) => axios.get(
  _communityQuestionsData.replace('{id}', communityId),
);

export const getCommunityQuestion = (questionId) => axios.get(
  _communitySingleQuestionData.replace('{id}', questionId),
);

export const createCommunityQuestion = (communityId, payload) => axios.post(
  _communityQuestionsData.replace('{id}', communityId),
  payload,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);

export const getCommunityQuestionAnswers = (questionId) => axios.get(
  _communityQuestionAnswersData.replace('{id}', questionId),
);

export const createCommunityQuestionAnswer = (questionId, payload) => axios.post(
  _communityQuestionAnswersData.replace('{id}', questionId),
  payload,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);

export const getCommunityQuestionComments = (questionId) => axios.get(
  _communityQuestionCommentsData.replace('{id}', questionId),
);

export const createCommunityQuestionComment = (questionId, payload) => axios.post(
  _communityQuestionCommentsData.replace('{id}', questionId),
  payload,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);
