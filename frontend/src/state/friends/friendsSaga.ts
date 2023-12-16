import {
  AcceptFriendRequest,
  AddFriend,
  CancelFriendRequest,
  GetFriends,
  RejectFriendRequest,
  RemoveFriend,
} from "@/typing/actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { sendErrorMessageToAlert, sendInfoMessageToAlert } from "../components";
import * as api from "./friendsApi";
import * as actions from "./friendsSlice";

function* getFriendsWorker({ payload }: GetFriends): any {
  try {
    const friends = yield call(api.getFriendsApi, payload);
    yield put(actions.getFriendsSuccess(friends));
  } catch (error) {
    yield put(actions.getFriendsFailed);
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get friends. Check your internet connection."
      )
    );
  }
}

function* addFriendWorker({ payload }: AddFriend) {
  try {
    yield call(api.addFriendApi, payload);
    yield put(actions.addFriendSuccess());
    yield put(sendInfoMessageToAlert("Friend request successfully sent."));
  } catch (error) {
    yield put(actions.addFriendFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to add friend. Check your internet connection."
      )
    );
  }
}

function* removeFriendWorker({ payload }: RemoveFriend) {
  try {
    yield call(api.removeFriendApi, payload);
    yield put(actions.removeFriendSuccess());
    yield put(sendInfoMessageToAlert("User removed from friends."));
  } catch (error) {
    yield put(actions.removeFriendFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to remove friend. Check your internet connection."
      )
    );
  }
}

function* getFriendRequestsWorker(): any {
  try {
    const requests = yield call(api.getFriendRequestsApi);
    yield put(actions.getFriendRequestSuccess(requests));
  } catch (error) {
    yield put(actions.getFriendRequestFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get friend requests. Check your internet connection."
      )
    );
  }
}

function* acceptFriendRequestWorker({ payload }: AcceptFriendRequest) {
  try {
    yield call(api.acceptFriendRequestApi, payload);
    yield put(actions.acceptFriendRequestSuccess());
    yield put(sendInfoMessageToAlert("User added to friends."));
  } catch (error) {
    yield put(actions.acceptFriendRequestFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to accept friend requests. Check your internet connection."
      )
    );
  }
}

function* rejectFriendRequestWorker({ payload }: RejectFriendRequest) {
  try {
    yield call(api.rejectFriendRequestApi, payload);
    yield put(actions.rejectFriendRequestSuccess());
    yield put(sendInfoMessageToAlert("User friend requests rejected."));
  } catch (error) {
    yield put(actions.rejectFriendRequestFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to reject friend requests. Check your internet connection."
      )
    );
  }
}

function* cancelFriendRequestWorker({ payload }: CancelFriendRequest) {
  try {
    yield call(api.cancelFriendRequestApi, payload);
    yield put(actions.cancelFriendRequestSuccess());
    yield put(sendInfoMessageToAlert("Friend request canceled."));
  } catch (error) {
    yield put(actions.cancelFriendRequestFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to cancel friend requests. Check your internet connection."
      )
    );
  }
}

function* getFriendNotificationsWorker(): any {
  try {
    const notifications = yield call(api.getFriendNotificationsApi);
    yield put(actions.getFriendNotificationsSuccess(notifications));
  } catch (error) {
    yield put(actions.getFriendNotificationsFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get friend notifications. Check your internet connection."
      )
    );
  }
}

function* friendsWatcher() {
  yield takeLatest(actions.getFriends.type, getFriendsWorker);
  yield takeLatest(actions.addFriend.type, addFriendWorker);
  yield takeLatest(actions.removeFriend.type, removeFriendWorker);
  yield takeLatest(actions.getFriendRequests.type, getFriendRequestsWorker);
  yield takeLatest(actions.acceptFriendRequest.type, acceptFriendRequestWorker);
  yield takeLatest(actions.rejectFriendRequest.type, rejectFriendRequestWorker);
  yield takeLatest(actions.cancelFriendRequest.type, cancelFriendRequestWorker);
  yield takeLatest(
    actions.getFriendNotifications.type,
    getFriendNotificationsWorker
  );
}

export default friendsWatcher;
