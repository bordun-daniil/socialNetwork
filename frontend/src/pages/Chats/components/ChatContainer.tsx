import { FC, useEffect, cloneElement, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  selectIsChatLoading,
  selectSingleChat,
  selectUserData,
} from "@/selectors";
import { removeChatNotification } from "@/state/chat";

interface ChatContainerProps {
  action: (chatId: number | string) => void;
}

const ChatContainer: FC<ChatContainerProps> = ({ action, children }) => {
  const { pk } = useParams<{ pk: string }>();
  const chat = useSelector(selectSingleChat);
  const userId = useSelector(selectUserData).id;
  const isLoading = useSelector(selectIsChatLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(action(pk));
    dispatch(removeChatNotification(Number(pk)));
  }, [dispatch, action, pk]);

  return cloneElement(children as ReactElement<any>, {
    chat,
    userId,
    isLoading,
  });
};

export default ChatContainer;
