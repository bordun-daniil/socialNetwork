import { FC } from "react";
import { PrivateChatDetails as IPrivateChat } from "@/typing/entities";
import Message from "../components/Message";
import Chat from "../components/Chat";
import Loading from "@/common/Loading";

interface ChatProps {
  chat?: IPrivateChat;
  userId?: number;
  isLoading?: boolean;
}

const PrivateChat: FC<ChatProps> = ({ chat, userId, isLoading }) => {
  if (chat && userId)
    return (
      <Chat
        chatId={chat.id}
        chatAvatar={chat.companion?.avatar_image}
        chatName={chat.companion?.username}
      >
        {isLoading ? (
          <Loading />
        ) : (
          chat.messages?.map((message) => (
            <Message message={message} userId={userId} key={message.id} />
          ))
        )}
      </Chat>
    );
  return null;
};

export default PrivateChat;
