import { combineReducers } from "redux";

import authReducer, { signOut } from "./auth/authSlice";
import userReducer from "./user/userSlice";
import postsReducer from "./posts/postsSlice";
import commentsReducer from "./comments/commentsSlice";
import componentsReducer from "./components/componentsSlice";
import friendsReducer from "./friends/friendsSlice";
import followersReducer from "./followers/followersSlice";
import chatReducer from "./chat/chatSlice";

const rootReducer = (state: any, action: any) => {
  if (action.type === signOut.type) return undefined;
  return appReducer(state, action);
};

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  posts: postsReducer,
  comments: commentsReducer,
  components: componentsReducer,
  friends: friendsReducer,
  followers: followersReducer,
  chat: chatReducer,
});

export default rootReducer;
