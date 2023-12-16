import { Middleware } from "redux";
import { getAccessToken } from "@/utils";
import {
  addMessageToChat,
  getPrivateChatSuccess,
  getGroupChatSuccess,
  sendMessage,
  createGroupChatSuccess,
  getChats,
  getUnseenChatsNotificationsSuccess,
} from "./chatSlice";

const accessToken = getAccessToken();

let chatSocket: WebSocket;

export const chatMiddleware: Middleware = (store) => (next) => (action) => {
  if (chatSocket) {
    chatSocket.onmessage = (e) => {
      const newMessage = JSON.parse(e.data);
      store.dispatch(addMessageToChat(newMessage));
    };
  }

  switch (action.type) {
    case getPrivateChatSuccess.type:
      if (chatSocket) chatSocket.close();
      const privateChatId = action.payload.id;

      chatSocket = new WebSocket(
        `ws://127.0.0.1:8000/ws/private_chat/${privateChatId}/?token=${accessToken}`
      );
      break;

    case getGroupChatSuccess.type:
      if (chatSocket) chatSocket.close();
      const groupChatId = action.payload.id;

      chatSocket = new WebSocket(
        `ws://127.0.0.1:8000/ws/group_chat/${groupChatId}/?token=${accessToken}`
      );
      break;

    case createGroupChatSuccess.type:
      store.dispatch(getChats());
      break;

    case sendMessage.type:
      chatSocket.send(JSON.stringify({ message: action.payload }));
      break;
  }

  return next(action);
};

const notificationSocket = accessToken
  ? new WebSocket(
      `ws://127.0.0.1:8000/ws/chat_notifications/?token=${accessToken}`
    )
  : null;

export const chatNotificationSocket: Middleware =
  (store) => (next) => (action) => {
    if (notificationSocket) {
      notificationSocket.onmessage = (e) => {
        const chatId = JSON.parse(e.data);
        store.dispatch(getUnseenChatsNotificationsSuccess(chatId));
      };
    }

    return next(action);
  };
