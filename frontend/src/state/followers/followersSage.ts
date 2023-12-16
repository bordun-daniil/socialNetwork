import { call, put, takeLatest } from "redux-saga/effects";
import { Follow, Unfollow } from "@/typing/actions";
import * as api from "./followersApi";
import * as actions from "./followersSlice";
import { sendErrorMessageToAlert } from "../components";

function* getFollowersWorker(): any {
  try {
    const followers = yield call(api.getFollowers);
    yield put(actions.getFollowersSuccess(followers));
  } catch (error) {
    yield put(actions.getFollowersFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get followers. Check your internet connection."
      )
    );
  }
}

function* getFollowingWorker(): any {
  try {
    const followers = yield call(api.getFollowing);
    yield put(actions.getFollowingSuccess(followers));
  } catch (error) {
    yield put(actions.getFollowingFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get followings. Check your internet connection."
      )
    );
  }
}

function* followWorker({ payload }: Follow) {
  try {
    yield call(api.followApi, payload);
    yield put(actions.followSuccess());
  } catch (error: any) {
    yield put(actions.followFailed());
    yield put(
      sendErrorMessageToAlert("An error occurred while trying to follow.")
    );
  }
}

function* unfollowWorker({ payload }: Unfollow) {
  try {
    yield call(api.unfollowApi, payload);
    yield put(actions.unfollowSuccess());
  } catch (error) {
    yield put(actions.unfollowFailed());
    yield put(
      sendErrorMessageToAlert("An error occurred while trying to unfollow.")
    );
  }
}

function* followersWatcher() {
  yield takeLatest(actions.getFollowers.type, getFollowersWorker);
  yield takeLatest(actions.getFollowing.type, getFollowingWorker);
  yield takeLatest(actions.follow.type, followWorker);
  yield takeLatest(actions.unfollow.type, unfollowWorker);
}

export default followersWatcher;
