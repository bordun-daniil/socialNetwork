import { FC } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Post } from "@/typing/entities";
import { selectIsPostsLoading } from "@/selectors";
import Loading from "@/common/Loading";

interface PostsProps {
  posts: Post[];
}

const Posts: FC<PostsProps> = ({ posts }) => {
  const isLoading = useSelector(selectIsPostsLoading);

  return (
    <div className="post-list">
      {isLoading ? (
        <Loading />
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Link
            to={`/post/${post.id}`}
            key={post.id}
            className="post"
            style={
              post.post_images
                ? { backgroundImage: `url(${post.post_images[0]?.image})` }
                : {
                    background: "var(--light-grey)",
                    border: "2px solid var(--grey)",
                  }
            }
          ></Link>
        ))
      ) : (
        <h3 className="no-posts-message">there is nothing here yet</h3>
      )}
    </div>
  );
};

export default Posts;
