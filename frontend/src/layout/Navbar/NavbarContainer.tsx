import { FC } from "react";
import { useSelector } from "react-redux";
import {
  selectActiveNavbarLink,
  selectChatNotifications,
  selectFriendRequestsQuantity,
  selectIsAuth,
  selectUserData,
} from "@/selectors";
import Navbar from "./Navbar";

const NavbarContainer: FC = () => {
  const isAuth = useSelector(selectIsAuth);
  const avatarImage = useSelector(selectUserData)?.avatar_image;
  const activeNavbarLink = useSelector(selectActiveNavbarLink);
  const isChatHasNotifications =
    useSelector(selectChatNotifications)?.length > 0;
  const isUserHasFriendRequests = useSelector(selectFriendRequestsQuantity) > 0;

  if (!isAuth) return null;

  return (
    <Navbar
      avatarImage={avatarImage}
      activeNavbarLink={activeNavbarLink}
      isChatHasNotifications={isChatHasNotifications}
      isUserHasFriendRequests={isUserHasFriendRequests}
    />
  );
};

export default NavbarContainer;
