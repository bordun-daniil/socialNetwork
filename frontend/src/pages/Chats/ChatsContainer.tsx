import { useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activateNavbarLink,
  toggleCreateGroupChatTab,
} from "@/state/components";
import { getChats } from "@/state/chat";
import {
  selectChatNotifications,
  selectChats,
  selectIsChatLoading,
  selectIsShowCreateGroupChatTab,
} from "@/selectors";
import { NavbarLinks } from "@/typing/entities";
import Chats from "./Chats";

const ChatsContainer: FC = () => {
  const chats = useSelector(selectChats);
  const isShowTab = useSelector(selectIsShowCreateGroupChatTab);
  const chatNotifications = useSelector(selectChatNotifications);
  const isLoading = useSelector(selectIsChatLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(activateNavbarLink(NavbarLinks.CHATS));
    dispatch(getChats());
  }, [dispatch]);

  return (
    <Chats
      chats={chats}
      isShowTab={isShowTab}
      isLoading={isLoading}
      chatNotifications={chatNotifications}
      toggleTab={() => dispatch(toggleCreateGroupChatTab())}
    />
  );
};

export default ChatsContainer;
