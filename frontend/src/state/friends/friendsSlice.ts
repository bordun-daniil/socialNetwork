import { createSlice } from "@reduxjs/toolkit";
import { FriendsState } from "@/typing/state";

const initialState: FriendsState = {
  friends: [],
  requests: [],
  notificationsQuantity: 0,
  isLoading: false,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    getFriends: (state, { payload }) => {
      state.isLoading = true;
    },
    getFriendsSuccess: (state, { payload }) => {
      state.friends = payload;
      state.isLoading = false;
    },
    getFriendsFailed: (state) => {
      state.isLoading = false;
    },

    addFriend: (state, { payload }) => {
      state.isLoading = true;
    },
    addFriendSuccess: (state) => {
      state.isLoading = false;
    },
    addFriendFailed: (state) => {
      state.isLoading = false;
    },

    removeFriend: (state, { payload }) => {
      state.isLoading = true;
    },
    removeFriendSuccess: (state) => {
      state.isLoading = false;
    },
    removeFriendFailed: (state) => {
      state.isLoading = false;
    },

    getFriendRequests: (state) => {
      state.isLoading = true;
    },
    getFriendRequestSuccess: (state, { payload }) => {
      state.requests = payload;
      state.notificationsQuantity = 0;
      state.isLoading = false;
    },
    getFriendRequestFailed: (state) => {
      state.isLoading = false;
    },

    acceptFriendRequest: (state, { payload }) => {
      state.requests = state.requests.filter((user) => user.id !== payload);
      state.isLoading = true;
    },
    acceptFriendRequestSuccess: (state) => {
      state.isLoading = false;
    },
    acceptFriendRequestFailed: (state) => {
      state.isLoading = false;
    },

    rejectFriendRequest: (state, { payload }) => {
      state.requests = state.requests.filter((user) => user.id !== payload);
      state.isLoading = true;
    },
    rejectFriendRequestSuccess: (state) => {
      state.isLoading = false;
    },
    rejectFriendRequestFailed: (state) => {
      state.isLoading = false;
    },

    cancelFriendRequest: (state, { payload }) => {
      state.isLoading = true;
    },
    cancelFriendRequestSuccess: (state) => {
      state.isLoading = false;
    },
    cancelFriendRequestFailed: (state) => {
      state.isLoading = false;
    },

    getFriendNotifications: (state) => {
      state.isLoading = true;
    },
    getFriendNotificationsSuccess: (state, { payload }) => {
      state.notificationsQuantity = payload;
      state.isLoading = false;
    },
    getFriendNotificationsFailed: (state) => {
      state.isLoading = false;
    },

    resetFriendNotifications: (state) => {
      state.notificationsQuantity = 0;
    },
  },
});

export default friendsSlice.reducer;
export const {
  getFriends,
  getFriendsSuccess,
  getFriendsFailed,
  addFriend,
  addFriendSuccess,
  addFriendFailed,
  removeFriend,
  removeFriendSuccess,
  removeFriendFailed,
  getFriendRequests,
  getFriendRequestSuccess,
  getFriendRequestFailed,
  acceptFriendRequest,
  acceptFriendRequestSuccess,
  acceptFriendRequestFailed,
  rejectFriendRequest,
  rejectFriendRequestSuccess,
  rejectFriendRequestFailed,
  cancelFriendRequest,
  cancelFriendRequestSuccess,
  cancelFriendRequestFailed,
  getFriendNotifications,
  getFriendNotificationsSuccess,
  getFriendNotificationsFailed,
  resetFriendNotifications,
} = friendsSlice.actions;
