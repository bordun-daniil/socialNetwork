export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  sex: "M" | "F" | "N";
  bio: string;
  avatar_image: string;
  header_image: string;
  user_images: string[];
  followers_quantity: number;
  following_quantity: number;
}

export interface OtherUser extends User {
  is_following: boolean;
  is_friend: boolean;
  is_friend_request_sent: boolean;
}

export interface UserLink {
  id: number;
  username: string;
  avatar_image: string;
}

export interface PostImage {
  id: number;
  user: number;
  image: string;
}

export interface Post {
  id: number;
  is_liked: boolean;
  user: UserLink;
  content: string;
  created_at: string;
  likes: number;
  post_images?: PostImage[];
}

export interface PostCreationData {
  content: string;
  post_images: any[];
}

export interface Comment {
  id: number;
  is_liked: boolean;
  user: UserLink;
  content: string;
  created_at: string;
  likes: number;
  children: Comment[];
}

export interface CreatedComment {
  post: number;
  content: string;
  replay_to: number;
}

export interface SignInData {
  username: string;
  password: string;
}

export interface SignUpData extends SignInData {
  email: string;
}

export interface Message {
  id: number;
  user: UserLink;
  text: string;
  created_at: string;
  room: number;
}

export interface PrivateChat {
  id: number;
  companion: UserLink;
}

export interface PrivateChatDetails extends PrivateChat {
  messages: Message[];
}

export interface GroupChat {
  id: number;
  users: UserLink[];
  name: string;
  icon: string;
}

export interface GroupChatDetails extends GroupChat {
  messages: Message[];
}

export interface GroupChatCreationData {
  name: string;
  icon: any;
  users: string[];
}

export interface Alert {
  alertType: AlertTypes;
  message: string;
}

export enum AlertTypes {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export enum NavbarLinks {
  FEED = "FEED",
  CHATS = "CHATS",
  FRIENDS = "FRIENDS",
  ADD_POST = "ADD_POST",
  PROFILE = "PROFILE",
}
