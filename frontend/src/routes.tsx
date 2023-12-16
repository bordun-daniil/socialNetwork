import { Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./common/components/PrivateRoute";
import NavbarContainer from "./layout/Navbar/NavbarContainer";
import Alert from "./common/components/Alert";
import Loading from "./common/Loading";

const SignInContainer = lazy(() => import("./pages/SignIn/SignInContainer"));
const SignUpContainer = lazy(() => import("./pages/SignUp/SignUpContainer"));
const OwnProfileContainer = lazy(
  () => import("./pages/Profile/OwnProfile/OwnProfileContainer")
);
const OtherProfileContainer = lazy(
  () => import("./pages/Profile/OtherProfile/OtherProfileContainer")
);
const AddPostContainer = lazy(() => import("./pages/AddPost/AddPostContainer"));
const FeedContainer = lazy(() => import("./pages/Feed/FeedContainer"));
const ChatsContainer = lazy(() => import("./pages/Chats/ChatsContainer"));
const PostContainer = lazy(() => import("./pages/Post/PostContainer"));
const PrivateChatContainer = lazy(
  () => import("./pages/Chats/PrivateChat/PrivateChatContainer")
);
const GroupChatContainer = lazy(
  () => import("./pages/Chats/GroupChat/GroupChatContainer")
);
const People = lazy(() => import("./pages/People/People"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const EditProfile = lazy(() => import("./pages/Settings/EditProfile"));
const Followers = lazy(() => import("./pages/Follow/Followers"));
const Following = lazy(() => import("./pages/Follow/Following"));
const Home = lazy(() => import("./pages/Home/Home"));
const NotificationsContainer = lazy(
  () => import("./pages/Notifications/NotificationsContainer")
);

const routes = (
  <BrowserRouter>
    <NavbarContainer />
    <Alert />
    <main>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />

          <Route exact path="/sign_in/" component={SignInContainer} />
          <Route exact path="/sign_up/" component={SignUpContainer} />

          <PrivateRoute
            exact
            path="/profile/"
            component={OwnProfileContainer}
          />
          <PrivateRoute exact path="/add_post/" component={AddPostContainer} />
          <PrivateRoute exact path="/people/" component={People} />
          <PrivateRoute exact path="/feed/" component={FeedContainer} />
          <PrivateRoute exact path="/chats/" component={ChatsContainer} />

          <PrivateRoute exact path="/settings/" component={Settings} />
          <PrivateRoute exact path="/edit_profile/" component={EditProfile} />
          <PrivateRoute
            exact
            path="/notifications/"
            component={NotificationsContainer}
          />

          <PrivateRoute exact path="/followers/" component={Followers} />
          <PrivateRoute exact path="/following/" component={Following} />

          <PrivateRoute exact path="/post/:pk/" component={PostContainer} />
          <PrivateRoute
            exact
            path="/user/:pk/"
            component={OtherProfileContainer}
          />
          <PrivateRoute
            exact
            path="/private_chat/:pk/"
            component={PrivateChatContainer}
          />
          <PrivateRoute
            exact
            path="/group_chat/:pk/"
            component={GroupChatContainer}
          />
        </Switch>
      </Suspense>
    </main>
  </BrowserRouter>
);

export default routes;
