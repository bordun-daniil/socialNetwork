import { FC } from "react";
import { Post as IPost } from "@/typing/entities";
import UserLinkComponent from "@/common/components/UserLinkComponent";
import PostImages from "@/common/components/PostImages";
import Like from "@/common/components/Like";
import CommentForm from "./CommentForm";

interface PostProps {
  post: IPost;
  likePost: () => void;
}

const Post: FC<PostProps> = ({ post, likePost, children }) => {
  return (
    <section className="post__page">
      <div className="post-body">
        <UserLinkComponent userLink={post.user} />
        <PostImages post={post} />
        <p>{post.content}</p>
        <Like isLiked={post.is_liked} likeAction={likePost} />
        <h6 className="likes">{post.likes} likes</h6>
        <CommentForm postId={post.id} />
      </div>
      {children}
    </section>
  );
};

export default Post;
