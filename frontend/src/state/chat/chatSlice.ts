import { createSlice } from "@reduxjs/toolkit";
import { ChatState } from "@/typing/state";
import { PrivateChatDetails, GroupChatDetails } from "@/typing/entities";

const initialState: ChatState = {
  chats: [],
  singleChat: {} as PrivateChatDetails | GroupChatDetails,
  notifications: [],
  isLoading: false,
};

const chatSlice = createSlice({
  initialState,
  name: "chat",
  reducers: {
    getChats: (state) => {
      state.isLoading = true;
    },
    getChatsSuccess: (state, { payload }) => {
      state.chats = payload;
      state.isLoading = false;
    },
    getChatsFailed: (state) => {
      state.isLoading = false;
    },

    getPrivateChat: (state, { payload }) => {
      state.isLoading = true;
    },
    getPrivateChatSuccess: (state, { payload }) => {
      state.singleChat = payload;
      state.isLoading = false;
    },
    getPrivateChatFailed: (state) => {
      state.isLoading = false;
    },

    getGroupChat: (state, { payload }) => {
      state.isLoading = true;
    },
    getGroupChatSuccess: (state, { payload }) => {
      state.singleChat = payload;
      state.isLoading = false;
    },
    getGroupChatFailed: (state) => {
      state.isLoading = false;
    },

    createGroupChat: (state, { payload }) => {
      state.isLoading = true;
    },
    createGroupChatSuccess: (state) => {
      state.isLoading = false;
    },
    createGroupChatFailed: (state) => {
      state.isLoading = false;
    },

    createPrivateChat: (state, { payload }) => {
      state.isLoading = true;
    },
    createPrivateChatSuccess: (state) => {
      state.isLoading = false;
    },
    createPrivateChatFailed: (state) => {
      state.isLoading = false;
    },

    getUnseenChatsNotifications: (state) => {
      state.isLoading = true;
    },
    getUnseenChatsNotificationsSuccess: (state, { payload }) => {
      state.notifications = payload;
      state.isLoading = false;
    },
    getUnseenChatsNotificationsFailed: (state) => {
      state.isLoading = false;
    },

    addMessageToChat: (state, { payload }) => {
      state.singleChat.messages.push(payload);
    },

    removeChatNotification: (state, { payload }) => {
      state.notifications = state.notifications.filter(
        (chatId) => chatId !== payload
      );
    },

    sendMessage: (state, { payload }) => {},
  },
});

export default chatSlice.reducer;
export const {
  getChats,
  getChatsSuccess,
  getChatsFailed,
  getPrivateChat,
  getPrivateChatSuccess,
  getPrivateChatFailed,
  getGroupChat,
  getGroupChatSuccess,
  getGroupChatFailed,
  createGroupChat,
  createGroupChatSuccess,
  createGroupChatFailed,
  createPrivateChat,
  createPrivateChatSuccess,
  createPrivateChatFailed,
  getUnseenChatsNotifications,
  getUnseenChatsNotificationsSuccess,
  getUnseenChatsNotificationsFailed,
  addMessageToChat,
  removeChatNotification,
  sendMessage,
} = chatSlice.actions;
