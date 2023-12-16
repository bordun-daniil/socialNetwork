import { FC, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useInput } from "@/hooks";
import { createComment } from "@/state/comments";

interface CommentFormProps {
  postId: string | number;
  replayTo?: number;
}

const CommentForm: FC<CommentFormProps> = ({ postId, replayTo = null }) => {
  const dispatch = useDispatch();
  const {
    value: contentValue,
    bind: contentBind,
    reset: contentReset,
  } = useInput();

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = {
      post: postId,
      replay_to: replayTo,
      content: contentValue,
    };
    dispatch(createComment(comment));
    contentReset();
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea {...contentBind} placeholder="Write comment" required />
      <button className="comment-submit-button">Submit</button>
    </form>
  );
};

export default CommentForm;
