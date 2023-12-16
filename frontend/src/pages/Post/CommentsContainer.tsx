import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectPostComments } from "@/selectors";
import { getPostComments, likeComment } from "@/state/comments";
import Comments from "./Comments";
import Comment from "./Comment";

interface CommentsContainerProps {
  postId: string;
}

const CommentsContainer: FC<CommentsContainerProps> = ({ postId }) => {
  const comments = useSelector(selectPostComments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPostComments(postId));
  }, [dispatch, postId]);

  return (
    <Comments>
      {comments.map((comment) => (
        <Comment
          postId={postId}
          comment={comment}
          key={comment.id}
          likeAction={(commentId) => dispatch(likeComment(commentId))}
        />
      ))}
    </Comments>
  );
};

export default CommentsContainer;
