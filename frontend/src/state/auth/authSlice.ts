import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@/typing/state";

const initialState: AuthState = {
  isAuth: (localStorage.getItem("access_token") ? true : false) as boolean,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, { payload }) => {
      state.isLoading = true;
    },
    signInSuccess: (state) => {
      state.isAuth = true;
      state.isLoading = false;
    },
    signInFailed: (state) => {
      state.isAuth = false;
      state.isLoading = false;
    },

    signUp: (state, { payload }) => {
      state.isLoading = true;
    },
    signUpSuccess: (state) => {
      state.isLoading = false;
    },
    signUpFailed: (state) => {
      state.isAuth = false;
      state.isLoading = false;
    },

    signOut: (state) => {
      state.isLoading = true;
    },
    signOutSuccess: (state) => {
      state.isAuth = false;
      state.isLoading = false;
    },
    signOutFailed: (state) => {
      state.isLoading = false;
    },
  },
});

export default authSlice.reducer;
export const {
  signIn,
  signInSuccess,
  signInFailed,
  signUp,
  signUpSuccess,
  signUpFailed,
  signOut,
  signOutSuccess,
  signOutFailed,
} = authSlice.actions;
