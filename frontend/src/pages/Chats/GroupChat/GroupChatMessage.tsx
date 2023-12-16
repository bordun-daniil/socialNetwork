import { FC } from "react";
import { Message as IMessage } from "@/typing/entities";
import UserLinkComponent from "@/common/components/UserLinkComponent";
import Message from "../components/Message";

interface GroupChatMessageProps {
  message: IMessage;
  userId: number;
}

const GroupChatMessage: FC<GroupChatMessageProps> = ({ message, userId }) => {
  return (
    <Message message={message} userId={userId}>
      {message.user.id === userId ? null : (
        <UserLinkComponent userLink={message.user} />
      )}
    </Message>
  );
};

export default GroupChatMessage;
