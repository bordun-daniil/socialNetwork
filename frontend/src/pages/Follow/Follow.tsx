import { FC } from "react";
import { UserLink } from "@/typing/entities";
import UserLinkComponent from "@/common/components/UserLinkComponent";

interface FollowProps {
  users: UserLink[];
  pageName: string;
}

const Follow: FC<FollowProps> = ({ users, pageName }) => {
  return (
    <section className="follow__page">
      <h2>{pageName}</h2>
      <div className="users-list">
        {users?.map((user) => (
          <UserLinkComponent key={user.id} userLink={user} />
        ))}
      </div>
    </section>
  );
};

export default Follow;
