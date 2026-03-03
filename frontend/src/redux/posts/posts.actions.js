import { setAlert } from "../alert/alert.actions";
import {
  GET_POSTS,
  GET_POST,
  GET_TAG_POSTS,
  GET_USER_POSTS,
  POST_ERROR,
  DELETE_POST,
  ADD_POST,
} from "./posts.types";
import {
  allPostsData,
  singlePostData,
  allTagPostsData,
  userPostsData,
  createSinglePost,
  deleteSinglePost
} from "../../api/postsApis";

// Get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await allPostsData();

    dispatch({
      type: GET_POSTS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response?.data?.message || err.message, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status || 500 },
    });
  }
};

// Get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await singlePostData(id);

    dispatch({
      type: GET_POST,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response?.data?.message || err.message, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status || 500 },
    });
  }
};

//GET TAG POSTS
export const getTagPosts = (tagName) => async (dispatch) => {
  try {
    const res = await allTagPostsData(tagName);

    dispatch({
      type: GET_TAG_POSTS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response?.data?.message || err.message, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status || 500 },
    });
  }
};

// GET USER POSTS
export const getUserPosts = (id) => async (dispatch) => {
  try {
    const res = await userPostsData(id);

    dispatch({
      type: GET_USER_POSTS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response?.data?.message || err.message, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status || 500 },
    });
  }
};

// Add post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await createSinglePost(formData);

    const postData = res.data.data;
    if (typeof postData === 'object' && postData !== null && !Array.isArray(postData)) {
      dispatch({
        type: ADD_POST,
        payload: postData,
      });
    }

    dispatch(setAlert(res.data.message, "success"));

    dispatch(getPosts());
  } catch (err) {
    dispatch(setAlert(err.response?.data?.message || err.message, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status || 500 },
    });
  }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
  try {
    const res = await deleteSinglePost(id);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert(res.data.message, "success"));
  } catch (err) {
    dispatch(setAlert(err.response?.data?.message || err.message, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status || 500 },
    });
  }
};
