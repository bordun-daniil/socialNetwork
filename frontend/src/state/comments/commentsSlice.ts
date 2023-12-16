import { createSlice } from "@reduxjs/toolkit";
import { CommentsState } from "@/typing/state";
import { findComment } from "@/utils";

const initialState: CommentsState = {
  postComments: [],
  isLoading: false,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    getPostComments: (state, { payload }) => {
      state.isLoading = true;
    },
    getPostCommentsSuccess: (state, { payload }) => {
      state.postComments = payload;
      state.isLoading = false;
    },
    getPostCommentsFailed: (state) => {
      state.isLoading = false;
    },

    createComment: (state, { payload }) => {
      state.isLoading = true;
    },
    createCommentSuccess: (state, { payload }) => {
      state.isLoading = false;

      let parentCommentId = payload.replay_to;
      if (parentCommentId) {
        let parentComment = findComment(state.postComments, parentCommentId);
        parentComment?.children.push(payload);
      } else {
        state.postComments.push(payload);
      }
    },
    createCommentFailed: (state) => {
      state.isLoading = false;
    },

    likeComment: (state, { payload }) => {
      state.isLoading = true;

      let likedComment = findComment(state.postComments, payload);
      if (likedComment) {
        likedComment.is_liked = !likedComment.is_liked;
        likedComment.is_liked ? likedComment.likes++ : likedComment.likes--;
      }
    },
    likeCommentSuccess: (state) => {
      state.isLoading = false;
    },
    likeCommentFailed: (state) => {
      state.isLoading = false;
    },
  },
});

export default commentsSlice.reducer;
export const {
  getPostComments,
  getPostCommentsSuccess,
  getPostCommentsFailed,

  createComment,
  createCommentSuccess,
  createCommentFailed,

  likeComment,
  likeCommentSuccess,
  likeCommentFailed,
} = commentsSlice.actions;
