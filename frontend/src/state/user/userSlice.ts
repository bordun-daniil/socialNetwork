import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "@/typing/state";
import { OtherUser, User } from "@/typing/entities";

const initialState: UserState = {
  user: {} as User,
  otherUser: {} as OtherUser,
  searchResult: [],
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserData: (state) => {
      state.isLoading = true;
    },
    getUserDataSuccess: (state, { payload }) => {
      state.user = payload;
      state.isLoading = false;
    },
    getUserDataFailed: (state) => {
      state.isLoading = false;
    },

    getOtherUserData: (state, { payload }) => {
      state.isLoading = true;
    },
    getOtherUserDataSuccess: (state, { payload }) => {
      state.otherUser = payload;
      state.isLoading = false;
    },
    getOtherUserDataFailed: (state) => {
      state.isLoading = false;
    },

    findUser: (state, { payload }) => {
      state.isLoading = true;
    },
    findUserSuccess: (state, { payload }) => {
      state.searchResult = payload;
      state.isLoading = false;
    },
    findUserFailed: (state) => {
      state.isLoading = false;
    },

    editUser: (state, { payload }) => {
      state.isLoading = true;
    },
    editUserSuccess: (state) => {
      state.isLoading = false;
    },
    editUserFailed: (state) => {
      state.isLoading = false;
    },
  },
});

export default userSlice.reducer;
export const {
  getUserData,
  getUserDataSuccess,
  getUserDataFailed,
  getOtherUserData,
  getOtherUserDataSuccess,
  getOtherUserDataFailed,
  findUser,
  findUserSuccess,
  findUserFailed,
  editUser,
  editUserSuccess,
  editUserFailed,
} = userSlice.actions;
