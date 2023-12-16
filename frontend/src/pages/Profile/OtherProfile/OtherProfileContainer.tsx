import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOtherUserData } from "@/state/user";
import { getOtherUserPosts } from "@/state/posts";
import { addFriend, cancelFriendRequest, removeFriend } from "@/state/friends";
import { follow, unfollow } from "@/state/followers";
import { selectOtherUserData, selectOtherUserPosts } from "@/selectors";
import OtherProfile from "./OtherProfile";
import Profile from "../components/Profile";
import { createPrivateChat } from "@/state/chat";

const OtherProfileContainer: FC = () => {
  const otherUserData = useSelector(selectOtherUserData);
  const otherUserPosts = useSelector(selectOtherUserPosts);
  const dispatch = useDispatch();
  const { pk } = useParams<{ pk: string }>();

  useEffect(() => {
    dispatch(getOtherUserData(pk));
    dispatch(getOtherUserPosts(pk));
  }, [dispatch, pk]);

  return (
    <OtherProfile
      message={(userId) => dispatch(createPrivateChat(userId))}
      userId={pk}
    >
      <Profile user={otherUserData} posts={otherUserPosts}>
        <div className="follow-add-friend">
          <button
            onClick={() =>
              otherUserData.is_following
                ? dispatch(unfollow(pk))
                : dispatch(follow(pk))
            }
          >
            {otherUserData.is_following ? "Unfollow" : "Follow"}
          </button>
          <button
            onClick={() =>
              otherUserData.is_friend_request_sent
                ? dispatch(cancelFriendRequest(pk))
                : otherUserData.is_friend
                ? dispatch(removeFriend(pk))
                : dispatch(addFriend(pk))
            }
          >
            {otherUserData.is_friend_request_sent
              ? "Cancel request"
              : otherUserData.is_friend
              ? "Remove from friend"
              : "Add friend"}
          </button>
        </div>
      </Profile>
    </OtherProfile>
  );
};

export default OtherProfileContainer;
