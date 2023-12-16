import { all } from "redux-saga/effects";
import authWatcher from "./auth/authSaga";
import postsWatcher from "./posts/postsSaga";
import userWatcher from "./user/userSaga";
import commentsWatcher from "./comments/commentsSaga";
import friendsWatcher from "./friends/friendsSaga";
import followersWatcher from "./followers/followersSage";
import chatWatcher from "./chat/chatSaga";

function* rootSaga() {
  yield all([
    authWatcher(),
    userWatcher(),
    postsWatcher(),
    commentsWatcher(),
    friendsWatcher(),
    followersWatcher(),
    chatWatcher()
  ]);
}

export default rootSaga;
