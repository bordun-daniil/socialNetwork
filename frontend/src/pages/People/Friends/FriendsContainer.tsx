import { useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activateNavbarLink } from "@/state/components";
import { NavbarLinks } from "@/typing/entities";
import { selectFriends } from "@/selectors";
import Friends from "./Friends";
import { getFriends } from "@/state/friends";

const FriendsContainer: FC = () => {
  const dispatch = useDispatch();
  const friends = useSelector(selectFriends);

  useEffect(() => {
    dispatch(activateNavbarLink(NavbarLinks.FRIENDS));
    dispatch(getFriends(null));
  }, [dispatch]);

  return <Friends friends={friends} />;
};

export default FriendsContainer;
