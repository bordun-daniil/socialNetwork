import { put, call, takeLatest } from "redux-saga/effects";
import { SignIn, SignUp } from "@/typing/actions";
import * as actions from "./authSlice";
import * as api from "./authApi";
import { sendErrorMessageToAlert, sendInfoMessageToAlert } from "../components";

function* signInWorker({ payload }: SignIn) {
  try {
    yield call(api.signInApi, payload);
    yield put(actions.signInSuccess());
    yield put(sendInfoMessageToAlert("You are successfully signed in."));
  } catch (error: any) {
    yield put(actions.signInFailed());
    yield put(
      sendErrorMessageToAlert(
        `An error occurred while signing in. Error: ${error.response.data.error_message.invalid}`
      )
    );
  }
}

function* signUpWorker({ payload }: SignUp) {
  try {
    yield call(api.signUpApi, payload);
    yield put(actions.signUpSuccess());
    yield put(actions.signIn(payload));
  } catch (error: any) {
    yield put(actions.signUpFailed());
    yield put(
      sendErrorMessageToAlert(
        `An error occurred while signing up. Error: ${error.response.data.error_message.invalid}`
      )
    );
  }
}

function* signOutWorker() {
  try {
    yield call(api.signOutApi);
    yield put(actions.signOutSuccess());
  } catch (error) {
    yield put(actions.signOutFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while signing out. Check your internet connection."
      )
    );
  }
}

function* authWatcher() {
  yield takeLatest(actions.signIn.type, signInWorker);
  yield takeLatest(actions.signUp.type, signUpWorker);
  yield takeLatest(actions.signOut.type, signOutWorker);
}

export default authWatcher;
