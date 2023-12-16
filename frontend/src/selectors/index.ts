import { RootState } from "@/typing";

// AUTH
export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;

// POSTS
export const selectUserPosts = (state: RootState) => state.posts.userPosts;
export const selectOtherUserPosts = (state: RootState) =>
  state.posts.otherUserPosts;
export const selectSinglePost = (state: RootState) => state.posts.currentPost;
export const selectIsPostsLoading = (state: RootState) => state.posts.isLoading;
export const selectFeedPosts = (state: RootState) => state.posts.feedPosts;

// USER
export const selectUserData = (state: RootState) => state.user.user;
export const selectSearchResult = (state: RootState) => state.user.searchResult;
export const selectOtherUserData = (state: RootState) => state.user.otherUser;
export const selectIsUserLoading = (state: RootState) => state.user.isLoading;

// COMMENTS
export const selectPostComments = (state: RootState) =>
  state.comments.postComments;
export const selectIsCommentLoading = (state: RootState) =>
  state.comments.isLoading;

// COMPONENTS
export const selectActiveNavbarLink = (state: RootState) =>
  state.components.activeNavbarLink;
export const selectIsShowCreateGroupChatTab = (state: RootState) =>
  state.components.isShowCreateGroupChatTab;
export const selectAlert = (state: RootState) => state.components.alert;

// FRIENDS
export const selectFriends = (state: RootState) => state.friends.friends;
export const selectFriendRequests = (state: RootState) =>
  state.friends.requests;
export const selectFriendRequestsQuantity = (state: RootState) =>
  state.friends.notificationsQuantity;
export const selectIsFriendsLoading = (state: RootState) =>
  state.friends.isLoading;

// CHAT
export const selectChats = (state: RootState) => state.chat.chats;
export const selectSingleChat = (state: RootState) => state.chat.singleChat;
export const selectChatNotifications = (state: RootState) =>
  state.chat.notifications;
export const selectIsChatLoading = (state: RootState) => state.chat.isLoading;

// FOLLOWERS
export const selectFollowers = (state: RootState) => state.followers.followers;
export const selectFollowing = (state: RootState) => state.followers.following;
export const selectIsFollowersLoading = (state: RootState) =>
  state.followers.isLoading;
