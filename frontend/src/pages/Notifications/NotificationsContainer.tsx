import { selectFriendRequests } from "@/selectors";
import {
  acceptFriendRequest,
  getFriendRequests,
  rejectFriendRequest,
} from "@/state/friends";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notifications from "./Notifications";

const NotificationsContainer: FC = () => {
  const dispatch = useDispatch();
  const friendRequests = useSelector(selectFriendRequests);

  useEffect(() => {
    dispatch(getFriendRequests());
  }, [dispatch]);

  return (
    <Notifications
      friendRequests={friendRequests}
      acceptFriendRequest={(fromUser: number) =>
        dispatch(acceptFriendRequest(fromUser))
      }
      rejectFriendRequest={(fromUser: number) =>
        dispatch(rejectFriendRequest(fromUser))
      }
    />
  );
};

export default NotificationsContainer;
