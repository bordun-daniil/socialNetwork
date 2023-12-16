import { call, put, takeLatest } from "redux-saga/effects";
import { CreateComment, GetPostComments, LikeComment } from "@/typing/actions";
import { sendErrorMessageToAlert, sendInfoMessageToAlert } from "../components";
import * as actions from "./commentsSlice";
import * as api from "./commentsApi";

function* getPostCommentsWorker({ payload }: GetPostComments): any {
  try {
    const comments = yield call(api.getPostCommentsApi, payload);
    yield put(actions.getPostCommentsSuccess(comments));
  } catch (error) {
    yield put(actions.getPostCommentsFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get post comments. Check your internet connection."
      )
    );
  }
}

function* createComment({ payload }: CreateComment): any {
  try {
    const comments = yield call(api.createCommentApi, payload);
    yield put(actions.createCommentSuccess(comments));
    yield put(sendInfoMessageToAlert("Comment successfully created."));
  } catch (error: any) {
    yield put(actions.createCommentFailed());
    yield put(
      sendErrorMessageToAlert(
        `An error occurred while trying to create comments. Error: ${error.response.data.error_message.invalid}`
      )
    );
  }
}

function* likeCommentWorker({ payload }: LikeComment) {
  try {
    yield call(api.likeCommentApi, payload);
    yield put(actions.likeCommentSuccess());
  } catch (error) {
    yield put(actions.likeCommentFailed());
    yield put(
      sendErrorMessageToAlert("An error occurred while trying to like comment.")
    );
  }
}

function* commentsWatcher() {
  yield takeLatest(actions.getPostComments.type, getPostCommentsWorker);
  yield takeLatest(actions.createComment.type, createComment);
  yield takeLatest(actions.likeComment.type, likeCommentWorker);
}

export default commentsWatcher;
