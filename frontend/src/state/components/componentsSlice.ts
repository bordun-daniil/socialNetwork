import { createSlice } from "@reduxjs/toolkit";
import { ComponentsState } from "@/typing/state";
import { Alert, AlertTypes } from "@/typing/entities";

const initialState: ComponentsState = {
  activeNavbarLink: "",
  isShowCreateGroupChatTab: false,
  alert: {} as Alert,
};

const componentsSlice = createSlice({
  name: "components",
  initialState,
  reducers: {
    activateNavbarLink: (state, { payload }) => {
      state.activeNavbarLink = payload;
    },
    toggleCreateGroupChatTab: (state) => {
      state.isShowCreateGroupChatTab = !state.isShowCreateGroupChatTab;
    },
    sendInfoMessageToAlert: (state, { payload }) => {
      const alert = {
        alertType: AlertTypes.INFO,
        message: payload,
      };
      state.alert = alert;
    },
    sendWarningMessageToAlert: (state, { payload }) => {
      const alert = {
        alertType: AlertTypes.WARNING,
        message: payload,
      };
      state.alert = alert;
    },
    sendErrorMessageToAlert: (state, { payload }) => {
      const alert = {
        alertType: AlertTypes.ERROR,
        message: payload,
      };
      state.alert = alert;
    },
  },
});

export default componentsSlice.reducer;
export const {
  activateNavbarLink,
  toggleCreateGroupChatTab,
  sendInfoMessageToAlert,
  sendWarningMessageToAlert,
  sendErrorMessageToAlert,
} = componentsSlice.actions;
