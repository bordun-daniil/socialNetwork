import { FC } from "react";
import { Message as IMessage } from "@/typing/entities";

interface MessageProps {
  message: IMessage;
  userId: number;
}

const Message: FC<MessageProps> = ({ message, userId, children }) => {
  return (
    <div
      className="message-container"
      style={
        message.user.id === userId
          ? { display: "flex", justifyContent: "flex-end" }
          : undefined
      }
    >
      <div className="message">
        {children}
        <p>{message.text}</p>
        <span>{message.created_at}</span>
      </div>
    </div>
  );
};

export default Message;
