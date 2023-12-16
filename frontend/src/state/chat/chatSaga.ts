import { call, put, takeLatest } from "redux-saga/effects";
import {
  GetPrivateChat,
  GetGroupChat,
  CreateGroupChat,
  CreatePrivateChat,
} from "@/typing/actions";
import * as api from "./chatApi";
import * as actions from "./chatSlice";
import { sendErrorMessageToAlert, sendInfoMessageToAlert } from "../components";

function* getChatsWorker(): any {
  try {
    const chats = yield call(api.getChatsApi);
    yield put(actions.getChatsSuccess(chats));
  } catch (error) {
    yield put(actions.getChatsFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get chats. Check your internet connection."
      )
    );
  }
}

function* getPrivateChatWorker({ payload }: GetPrivateChat): any {
  try {
    const chat = yield call(api.getPrivateChatApi, payload);
    yield put(actions.getPrivateChatSuccess(chat));
  } catch (error) {
    console.log(error);
    yield put(actions.getPrivateChatFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get chat data. Check your internet connection."
      )
    );
  }
}

function* getGroupChatWorker({ payload }: GetGroupChat): any {
  try {
    const chat = yield call(api.getGroupChatApi, payload);
    yield put(actions.getGroupChatSuccess(chat));
  } catch (error) {
    yield put(actions.getGroupChatFailed());
    yield put(
      sendErrorMessageToAlert(
        "An error occurred while trying to get chat data. Check your internet connection."
      )
    );
  }
}

function* createGroupChatWorker({ payload }: CreateGroupChat) {
  try {
    yield call(api.createGroupChatApi, payload);
    yield put(actions.createGroupChatSuccess());
    sendInfoMessageToAlert("Group chat successfully created.");
  } catch (error: any) {
    yield put(actions.createGroupChatFailed());
    yield put(
      sendErrorMessageToAlert(
        `An error occurred while trying to create group chat. Error: ${error.response.data.error_message.invalid}}`
      )
    );
  }
}

function* createPrivateChatWorker({ payload }: CreatePrivateChat) {
  try {
    yield call(api.createPrivateChatApi, payload);
    yield put(actions.createPrivateChatSuccess());
    sendInfoMessageToAlert("Private chat successfully created.");
  } catch (error: any) {
    yield put(actions.createPrivateChatFailed());
    yield put(
      sendErrorMessageToAlert(
        `An error occurred while trying to create chat. Error: ${error.response.data.error_message.invalid}}`
      )
    );
  }
}

function* getUnseenChatsNotificationsWorker(): any {
  try {
    const chatsIds = yield call(api.getUnseenChatsNotificationsApi);
    yield put(actions.getUnseenChatsNotificationsSuccess(chatsIds));
  } catch (error) {
    yield put(actions.getUnseenChatsNotificationsFailed());
    yield put(
      sendErrorMessageToAlert(
        `An error occurred while trying to get chat notifications. Check your internet connection.`
      )
    );
  }
}

function* chatWatcher() {
  yield takeLatest(actions.getChats.type, getChatsWorker);
  yield takeLatest(actions.getPrivateChat.type, getPrivateChatWorker);
  yield takeLatest(actions.getGroupChat.type, getGroupChatWorker);
  yield takeLatest(actions.createGroupChat.type, createGroupChatWorker);
  yield takeLatest(actions.createPrivateChat.type, createPrivateChatWorker);
  yield takeLatest(
    actions.getUnseenChatsNotifications.type,
    getUnseenChatsNotificationsWorker
  );
}

export default chatWatcher;
