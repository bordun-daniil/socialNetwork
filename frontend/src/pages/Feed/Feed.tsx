import { useRef, FC } from "react";
import { Link } from "react-router-dom";
import { Post } from "@/typing/entities";
import { usePagination } from "@/hooks";
import UserLinkComponent from "@/common/components/UserLinkComponent";
import PostImages from "@/common/components/PostImages";
import Like from "@/common/components/Like";
import Loading from "@/common/Loading";

interface FeedProps {
  feedPosts: Post[];
  isLoading: boolean;
  getFeedPosts: (currentPostsQuantity: number) => void;
  likePost: (postId: number) => void;
}

const Feed: FC<FeedProps> = ({
  feedPosts,
  isLoading,
  getFeedPosts,
  likePost,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isAtPageBottom = usePagination(sectionRef);

  if (isAtPageBottom) getFeedPosts(feedPosts.length);

  return (
    <section className="feed__page" ref={sectionRef}>
      <div className="posts-list">
        {isLoading ? (
          <Loading />
        ) : feedPosts.length > 0 ? (
          feedPosts.map((post) => (
            <div className="post" key={post.id}>
              <UserLinkComponent userLink={post.user} />
              <PostImages post={post} />
              <p>{post.content}</p>
              <div className="panel">
                <Like
                  isLiked={post.is_liked}
                  likeAction={() => likePost(post.id)}
                />
                <Link className="comment-button" to={`/post/${post.id}/`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">
                    <path
                      d="M143,161q1-5.5,2-11l4-8,5-8,8-8,8-4,6-3,7-1h13l7,1,8,3,7,5,7,6,7,10,4,8,2,8v10l-2,8-3,8,2,8,6,18-16-1-8-1-5,2-6,2H187l-8-1-7-3-8-6-8-7-8-10-4-9-1-9Z"
                      transform="translate(-123 -108)"
                    />
                  </svg>
                </Link>
              </div>
              <h6 className="likes">{post.likes} likes</h6>
            </div>
          ))
        ) : (
          <h3 className="no-posts-message">there is nothing here yet</h3>
        )}
      </div>
    </section>
  );
};

export default Feed;
