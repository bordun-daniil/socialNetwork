import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFollowers } from "@/selectors";
import { getFollowers } from "@/state/followers/followersSlice";
import Follow from "./Follow";

const Followers: FC = () => {
  const dispatch = useDispatch();
  const followers = useSelector(selectFollowers);

  useEffect(() => {
    dispatch(getFollowers());
  }, [dispatch]);

  return <Follow users={followers} pageName={"Followers"} />;
};

export default Followers;
