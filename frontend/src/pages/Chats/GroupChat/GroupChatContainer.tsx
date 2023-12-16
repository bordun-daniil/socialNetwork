import { FC } from "react";
import { getGroupChat } from "@/state/chat";
import ChatContainer from "../components/ChatContainer";
import GroupChat from "./GroupChat";

const GroupChatContainer: FC = () => {
  return (
    <ChatContainer action={getGroupChat}>
      <GroupChat />
    </ChatContainer>
  );
};

export default GroupChatContainer;
