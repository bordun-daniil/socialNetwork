import { FC } from "react";

interface HeadProps {
  user: any;
}

const Head: FC<HeadProps> = ({ user, children }) => {
  return (
    <div className="head">
      <div
        className="head-image"
        style={
          user.header_image
            ? { backgroundImage: `url(${user.header_image})` }
            : { background: "var(--dark-grey)" }
        }
      >
        <h2>{user.username}</h2>
      </div>
      <div
        style={
          user.avatar_image
            ? { backgroundImage: `url(${user.avatar_image})` }
            : { background: "var(--orange)" }
        }
        className="avatar-image"
      />
      {children}

      <div className="bio">
        <h4 className="name">
          {user.first_name} {user.last_name}
        </h4>
        <p>{user.bio}</p>
      </div>
    </div>
  );
};

export default Head;
