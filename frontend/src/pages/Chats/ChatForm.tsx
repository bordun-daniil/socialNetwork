import { FC, useEffect, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useInput } from "@/hooks";
import { sendMessage } from "@/state/chat";

interface ChatFormProps {
  chatId: number;
}

const ChatForm: FC<ChatFormProps> = ({ chatId }) => {
  const {
    value: messageValue,
    bind: messageBind,
    reset: messageReset,
  } = useInput();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(sendMessage(messageValue));
    messageReset();
  };

  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <input {...messageBind} type="text" placeholder="Message" />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatForm;
