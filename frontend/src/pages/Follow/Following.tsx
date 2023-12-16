import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFollowing } from "@/selectors";
import { getFollowing } from "@/state/followers/followersSlice";
import Follow from "./Follow";

const Following: FC = () => {
  const dispatch = useDispatch();
  const following = useSelector(selectFollowing);

  useEffect(() => {
    dispatch(getFollowing());
  }, [dispatch]);

  return <Follow users={following} pageName={"Following"} />;
};

export default Following;
