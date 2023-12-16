import { call, put, takeLatest } from "redux-saga/effects";
import {
  CreatePost,
  GetOtherUserPosts,
  GetSinglePost,
  GetUserPosts,
  LikePost,
} from "@/typing/actions";
import * as actions from "./postsSlice";
import * as api from "./postsApi";
import { sendErrorMessageToAlert, sendInfoMessageToAlert } from "../components";

function* getUserPostsWorker(): any {
  try {
    const payload = yield call(api.getUserPostsApi);
    yield put(actions.getUserPostsSuccess(payload));
  } catch (error) {
    yield put(actions.getUserPostsFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get user posts. Check your internet connection."
      )
    );
  }
}

function* getOtherUserPostsWorker({ payload }: GetOtherUserPosts): any {
  try {
    const otherUserPosts = yield call(api.getOtherUserPostsApi, payload);
    yield put(actions.getOtherUserPostsSuccess(otherUserPosts));
  } catch (error) {
    yield put(actions.getOtherUserPostsFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get user data. Check your internet connection."
      )
    );
  }
}

function* createPostWorker({ payload }: CreatePost) {
  try {
    yield call(api.createPostApi, payload);
    yield put(actions.createPostSuccess());
    yield put(sendInfoMessageToAlert("Posts successfully created."));
  } catch (error) {
    yield put(actions.createPostFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to create posts. Check your internet connection."
      )
    );
  }
}

function* getSinglePostWorker({ payload }: GetSinglePost): any {
  try {
    const post = yield call(api.getSinglePost, payload);
    yield put(actions.getSinglePostSuccess(post));
  } catch (error) {
    yield put(actions.getSinglePostFailed);
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get post. Check your internet connection."
      )
    );
  }
}

function* getFeedPostsWorker({ payload }: GetUserPosts): any {
  try {
    const feedPosts = yield call(api.getFeedPostsApi, payload);
    yield put(actions.getFeedPostsSuccess(feedPosts));
  } catch (error) {
    yield put(actions.getFeedPostsFailed);
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get newsfeed. Check your internet connection."
      )
    );
  }
}

function* likePostWorker({ payload }: LikePost) {
  try {
    yield call(api.likePostApi, payload);
    yield put(actions.likePostSuccess());
  } catch (error) {
    yield put(actions.likePostFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to like post. Check your internet connection."
      )
    );
  }
}

function* postsWatcher() {
  yield takeLatest(actions.getUserPosts.type, getUserPostsWorker);
  yield takeLatest(actions.getOtherUserPosts.type, getOtherUserPostsWorker);
  yield takeLatest(actions.createPost.type, createPostWorker);
  yield takeLatest(actions.getSinglePost.type, getSinglePostWorker);
  yield takeLatest(actions.getFeedPosts.type, getFeedPostsWorker);
  yield takeLatest(actions.likePost.type, likePostWorker);
}

export default postsWatcher;
