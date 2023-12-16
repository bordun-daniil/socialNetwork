import { FC } from "react";

const Comments: FC = ({ children }) => {
  return (
    <div className="post-comments">
      <h3>Comments</h3>
      <div className="comments">{children}</div>
    </div>
  );
};

export default Comments;
