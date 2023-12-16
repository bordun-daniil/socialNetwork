import { FC } from "react";
import { Link } from "react-router-dom";
import { UserLink } from "@/typing/entities";

interface PostUserLinkProps {
  userLink: UserLink;
}

const UserLinkComponent: FC<PostUserLinkProps> = ({ userLink }) => {
  return (
    <Link className="user-link" to={`/user/${userLink?.id}/`}>
      <div
        className="avatar-image"
        style={
          userLink?.avatar_image
            ? { backgroundImage: `url(${userLink?.avatar_image})` }
            : { background: "var(--orange)" }
        }
      ></div>
      <h4 className="username">{userLink?.username}</h4>
    </Link>
  );
};

export default UserLinkComponent;
