import { FC } from "react";
import { UserLink } from "@/typing/entities";
import UserLinkComponent from "@/common/components/UserLinkComponent";

interface NotificationsProps {
  friendRequests: UserLink[];
  acceptFriendRequest: (fromUser: number) => void;
  rejectFriendRequest: (fromUser: number) => void;
}

const Notifications: FC<NotificationsProps> = ({
  friendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
}) => {
  return (
    <section className="notifications__page">
      <h2>Friend Requests</h2>
      {friendRequests.length > 0 ? (
        friendRequests.map((user) => (
          <div className="friend-request" key={user.id}>
            <UserLinkComponent userLink={user} />
            <div className="buttons">
              <button
                className="base-button"
                onClick={() => acceptFriendRequest(user.id)}
              >
                Accept
              </button>
              <button
                className="base-button"
                onClick={() => rejectFriendRequest(user.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <h3 className="no-posts-message">there is nothing here yet</h3>
      )}
    </section>
  );
};

export default Notifications;
