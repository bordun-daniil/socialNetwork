import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserData } from "@/selectors";
import UserLinkComponent from "@/common/components/UserLinkComponent";
import { signOut } from "@/state/auth";

const Settings: FC = () => {
  const user = useSelector(selectUserData);
  const dispatch = useDispatch();

  return (
    <section className="settings__page">
      <div className="container">
        <h2>Settings</h2>
        <UserLinkComponent userLink={user} />
        <Link to="/edit_profile/" className="edit-profile">
          Edit profile
        </Link>
        <button className="sign-out" onClick={() => dispatch(signOut())}>
          Sign out
        </button>
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="circle-3"></div>
      </div>
    </section>
  );
};

export default Settings;
