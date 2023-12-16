import { User, Post, UserLink, Comment, OtherUser, Alert } from "./entities";

export interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
}

export interface UserState {
  user: User;
  otherUser: OtherUser;
  searchResult: UserLink[];
  isLoading: boolean;
}

export interface PostsState {
  userPosts: Post[];
  otherUserPosts: Post[];
  currentPost: Post;
  feedPosts: Post[];
  isLoading: boolean;
}

export interface CommentsState {
  postComments: Comment[];
  isLoading: boolean;
}

export interface ComponentsState {
  activeNavbarLink: string;
  isShowCreateGroupChatTab: boolean;
  alert: Alert;
}

export interface FriendsState {
  friends: UserLink[];
  requests: UserLink[];
  notificationsQuantity: number;
  isLoading: boolean;
}

export interface ChatState {
  chats: any;
  singleChat: any;
  isLoading: boolean;
  notifications: number[];
}

export interface FollowersState {
  followers: UserLink[];
  following: UserLink[];
  isLoading: boolean;
}

export interface RootState {
  auth: AuthState;
  user: UserState;
  posts: PostsState;
  comments: CommentsState;
  components: ComponentsState;
  friends: FriendsState;
  chat: ChatState;
  followers: FollowersState;
}
