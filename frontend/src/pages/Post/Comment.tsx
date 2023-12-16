import { FC } from "react";
import { Comment as IComment } from "@/typing/entities";
import UserLinkComponent from "@/common/components/UserLinkComponent";
import Like from "@/common/components/Like";
import CommentForm from "./CommentForm";

interface CommentProps {
  postId: string;
  comment: IComment;
  likeAction: (commentId: number) => void;
}

const Comment: FC<CommentProps> = ({ postId, comment, likeAction }) => {
  return (
    <div className="comment">
      <div className="comment-body">
        <UserLinkComponent userLink={comment.user} />
        <p>{comment.content}</p>
        <Like
          isLiked={comment.is_liked}
          likeAction={() => likeAction(comment.id)}
        />
        <h6>{comment.likes} likes</h6>
        <h6 className="timestamp">{comment.created_at}</h6>
        <CommentForm postId={postId} replayTo={comment.id} />
      </div>
      <div className="children">
        {comment.children?.map((child) => (
          <Comment
            postId={postId}
            comment={child}
            likeAction={likeAction}
            key={child.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
