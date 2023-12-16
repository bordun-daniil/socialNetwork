import { axiosAPI } from "@/utils";
import { API_SERVER } from "@/env";

const rootPostsUrl = API_SERVER + "/api/feed";

export const getUserPostsApi = () =>
  axiosAPI.get(`${rootPostsUrl}/user_posts/`).then((response) => response.data);

export const getOtherUserPostsApi = (userId: number) =>
  axiosAPI
    .get(`${rootPostsUrl}/user_posts/?user_id=${userId}`)
    .then((response) => response.data);

export const createPostApi = (post: FormData) =>
  axiosAPI
    .post(`${rootPostsUrl}/user_posts/`, post)
    .then((response) => response.data);

export const getFeedPostsApi = (currentPostsQuantity: number) =>
  axiosAPI
    .get(`${rootPostsUrl}/?limit=5&offset=${currentPostsQuantity}`)
    .then((response) => response.data);

export const getSinglePost = (postId: number) =>
  axiosAPI.get(`${rootPostsUrl}/${postId}/`).then((response) => response.data);

export const likePostApi = (postId: number) =>
  axiosAPI
    .post(`${rootPostsUrl}/like_unlike_post/`, { post_id: postId })
    .then((response) => response.data);
