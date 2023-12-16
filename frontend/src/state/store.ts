import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import { chatMiddleware, chatNotificationSocket } from "./chat/chatMiddleware";
import { friendNotificationMiddleware } from "./friends/friendsMiddleware";

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  sagaMiddleware,
  chatMiddleware,
  chatNotificationSocket,
  friendNotificationMiddleware,
];

const store = configureStore({
  reducer: rootReducer,
  middleware: [...middleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

export default store;
