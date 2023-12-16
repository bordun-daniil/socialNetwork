import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getUserPosts } from "@/state/posts";
import { activateNavbarLink } from "@/state/components";
import {
  selectFriendRequestsQuantity,
  selectUserData,
  selectUserPosts,
} from "@/selectors";
import { NavbarLinks } from "@/typing/entities";
import OwnProfile from "./OwnProfile";
import Profile from "../components/Profile";

const OwnProfileContainer: FC = () => {
  const user = useSelector(selectUserData);
  const posts = useSelector(selectUserPosts);
  const isUserHasFriendRequests = useSelector(selectFriendRequestsQuantity) > 0;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserPosts());
    dispatch(activateNavbarLink(NavbarLinks.PROFILE));
  }, [dispatch]);

  return (
    <OwnProfile isUserHasFriendRequests={isUserHasFriendRequests}>
      <Profile user={user} posts={posts}>
        <div className="follow-info">
          <Link to="/followers/">{user.followers_quantity} Followers</Link>
          <Link to="/following/">{user.following_quantity} Following</Link>
        </div>
      </Profile>
    </OwnProfile>
  );
};

export default OwnProfileContainer;
