import { useEffect, FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserData } from "./state/user";
import { selectIsAuth } from "./selectors";
import routes from "./routes";
import { getUnseenChatsNotifications } from "./state/chat";
import { getFriendNotifications } from "./state/friends";

const App: FC = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth) {
      dispatch(getUserData());
      dispatch(getUnseenChatsNotifications());
      dispatch(getFriendNotifications());
    }
  }, [isAuth, dispatch]);

  return <>{routes}</>;
};

export default App;
