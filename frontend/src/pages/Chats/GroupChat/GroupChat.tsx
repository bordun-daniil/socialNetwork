import { FC } from "react";
import { GroupChatDetails } from "@/typing/entities";
import GroupChatMessage from "./GroupChatMessage";
import Chat from "../components/Chat";
import Loading from "@/common/Loading";

interface GroupChatProps {
  chat?: GroupChatDetails;
  userId?: number;
  isLoading?: boolean;
}

const GroupChat: FC<GroupChatProps> = ({ chat, userId, isLoading }) => {
  if (chat && userId)
    return (
      <Chat chatId={chat.id} chatAvatar={chat.icon} chatName={chat.name}>
        {isLoading ? (
          <Loading />
        ) : (
          chat.messages?.map((message) => (
            <GroupChatMessage
              message={message}
              userId={userId}
              key={message.id}
            />
          ))
        )}
      </Chat>
    );
  return null;
};

export default GroupChat;
