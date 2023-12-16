import { useEffect, FC } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectSinglePost } from "@/selectors";
import { getSinglePost, likePost } from "@/state/posts";
import Post from "./Post";
import CommentsContainer from "./CommentsContainer";

const PostContainer: FC = () => {
  const { pk } = useParams<{ pk: string }>();
  const currentPost = useSelector(selectSinglePost);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSinglePost(pk));
  }, [dispatch, pk]);

  return (
    <Post
      post={currentPost}
      likePost={() => dispatch(likePost(currentPost.id))}
    >
      <CommentsContainer postId={pk} />
    </Post>
  );
};

export default PostContainer;
