import { setAlert } from "../alert/alert.actions";
import {
  GET_ANSWERS,
  ANSWER_ERROR,
  ADD_ANSWER,
  DELETE_ANSWER,
  UPDATE_ANSWER_VOTES,
} from "./answers.types";
import { allAnswersData, createSingleAnswer, deleteSingleAnswer, upvoteAnswer as apiUpvoteAnswer, downvoteAnswer as apiDownvoteAnswer } from "../../api/answersApi";

export const getAnswers = (id) => async (dispatch) => {
  try {
    const res = await allAnswersData(id);

    dispatch({
      type: GET_ANSWERS,
      payload: Array.isArray(res.data.data) ? res.data.data : [],
    });
  } catch (err) {
    if (err.response?.status === 404) {
      dispatch({
        type: GET_ANSWERS,
        payload: [],
      });
      return;
    }

    dispatch({
      type: ANSWER_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status || 500 },
    });
  }
};

// Add Answer
export const addAnswer = (postId, formData) => async (dispatch) => {
  try {
    const res = await createSingleAnswer(postId, formData);

    dispatch({
      type: ADD_ANSWER,
      payload: res.data.data,
    });

    dispatch(setAlert(res.data.message, "success"));

    dispatch(getAnswers(postId));
  } catch (err) {
    dispatch(setAlert(err.response.data.message, "danger"));

    dispatch({
      type: ANSWER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Answer
export const deleteAnswer = (AnswerId) => async (dispatch) => {
  try {
    const res = await deleteSingleAnswer(AnswerId);

    dispatch({
      type: DELETE_ANSWER,
      payload: AnswerId,
    });

    dispatch(setAlert(res.data.message, "success"));
  } catch (err) {
    dispatch(setAlert(err.response.data.message, "danger"));

    dispatch({
      type: ANSWER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const upvoteAnswer = (id) => async (dispatch) => {
  try {
    const res = await apiUpvoteAnswer(id);
    dispatch({
      type: UPDATE_ANSWER_VOTES,
      payload: { id, upvotes: res.data.data.upvotes, downvotes: res.data.data.downvotes },
    });
  } catch (err) {
    dispatch({
      type: ANSWER_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status },
    });
  }
};

export const downvoteAnswer = (id) => async (dispatch) => {
  try {
    const res = await apiDownvoteAnswer(id);
    dispatch({
      type: UPDATE_ANSWER_VOTES,
      payload: { id, upvotes: res.data.data.upvotes, downvotes: res.data.data.downvotes },
    });
  } catch (err) {
    dispatch({
      type: ANSWER_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status },
    });
  }
};
