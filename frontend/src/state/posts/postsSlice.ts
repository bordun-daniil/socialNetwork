import { createSlice } from "@reduxjs/toolkit";
import { PostsState } from "@/typing/state";
import { Post } from "@/typing/entities";

const initialState: PostsState = {
  userPosts: [],
  otherUserPosts: [],
  currentPost: {} as Post,
  feedPosts: [],
  isLoading: false,
};

const postsSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getUserPosts: (state) => {
      state.isLoading = true;
    },
    getUserPostsSuccess: (state, { payload }) => {
      state.userPosts = payload;
      state.isLoading = false;
    },
    getUserPostsFailed: (state) => {
      state.isLoading = false;
    },

    getOtherUserPosts: (state, { payload }) => {
      state.isLoading = true;
    },
    getOtherUserPostsSuccess: (state, { payload }) => {
      state.otherUserPosts = payload;
      state.isLoading = false;
    },
    getOtherUserPostsFailed: (state) => {
      state.isLoading = false;
    },

    createPost: (state, { payload }) => {
      state.isLoading = true;
    },
    createPostSuccess: (state) => {
      state.isLoading = false;
    },
    createPostFailed: (state) => {
      state.isLoading = false;
    },

    getSinglePost: (state, { payload }) => {
      state.isLoading = true;
    },
    getSinglePostSuccess: (state, { payload }) => {
      state.currentPost = payload;
      state.isLoading = false;
    },
    getSinglePostFailed: (state) => {
      state.isLoading = false;
    },

    getFeedPosts: (state, { payload }) => {},
    getFeedPostsSuccess: (state, { payload }) => {
      for (let idx = 0; idx < payload.length; idx++) {
        const isPostInState = state.feedPosts.find(
          (post) => post.id === payload[idx].id
        );
        if (!isPostInState) {
          state.feedPosts.push(payload[idx]);
        }
      }
    },
    getFeedPostsFailed: (state) => {},

    likePost: (state, { payload }) => {
      let likedPost =
        state.feedPosts.find((post) => post.id === payload) ||
        state.currentPost;

      likedPost.is_liked = !likedPost.is_liked;
      likedPost.is_liked ? likedPost.likes++ : likedPost.likes--;
    },
    likePostSuccess: (state) => {},
    likePostFailed: (state) => {},
  },
});

export default postsSlice.reducer;
export const {
  getUserPosts,
  getUserPostsSuccess,
  getUserPostsFailed,
  getOtherUserPosts,
  getOtherUserPostsSuccess,
  getOtherUserPostsFailed,
  createPost,
  createPostSuccess,
  createPostFailed,
  getSinglePost,
  getSinglePostSuccess,
  getSinglePostFailed,
  getFeedPosts,
  getFeedPostsSuccess,
  getFeedPostsFailed,
  likePost,
  likePostSuccess,
  likePostFailed,
} = postsSlice.actions;
