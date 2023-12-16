import { FC } from "react";
import { getPrivateChat } from "@/state/chat";
import ChatContainer from "../components/ChatContainer";
import PrivateChat from "./PrivateChat";

const PrivateChatContainer: FC = () => {
  return (
    <ChatContainer action={getPrivateChat}>
      <PrivateChat />
    </ChatContainer>
  );
};

export default PrivateChatContainer;
