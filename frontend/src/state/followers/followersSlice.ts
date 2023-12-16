import { createSlice } from "@reduxjs/toolkit";
import { FollowersState } from "@/typing";

const initialState: FollowersState = {
  followers: [],
  following: [],
  isLoading: false,
};

const followersSlice = createSlice({
  name: "followers",
  initialState,
  reducers: {
    getFollowers: (state) => {
      state.isLoading = true;
    },
    getFollowersSuccess: (state, { payload }) => {
      state.followers = payload;
      state.isLoading = false;
    },
    getFollowersFailed: (state) => {
      state.isLoading = false;
    },

    getFollowing: (state) => {
      state.isLoading = true;
    },
    getFollowingSuccess: (state, { payload }) => {
      state.following = payload;
      state.isLoading = false;
    },
    getFollowingFailed: (state) => {
      state.isLoading = false;
    },

    follow: (state, { payload }) => {
      state.isLoading = true;
    },
    followSuccess: (state) => {
      state.isLoading = false;
    },
    followFailed: (state) => {
      state.isLoading = false;
    },

    unfollow: (state, { payload }) => {
      state.isLoading = true;
    },
    unfollowSuccess: (state) => {
      state.isLoading = false;
    },
    unfollowFailed: (state) => {
      state.isLoading = false;
    },
  },
});

export default followersSlice.reducer;
export const {
  getFollowers,
  getFollowersSuccess,
  getFollowersFailed,
  getFollowing,
  getFollowingSuccess,
  getFollowingFailed,
  follow,
  followSuccess,
  followFailed,
  unfollow,
  unfollowSuccess,
  unfollowFailed,
} = followersSlice.actions;
