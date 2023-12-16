import { axiosAPI } from "@/utils";
import { API_SERVER } from "@/env";

const rootUrl = API_SERVER + "/api/followers";

export const getFollowers = () =>
  axiosAPI.get(`${rootUrl}/followers/`).then((response) => response.data);

export const getFollowing = () =>
  axiosAPI.get(`${rootUrl}/following/`).then((response) => response.data);

export const followApi = (userId: number) =>
  axiosAPI
    .post(`${rootUrl}/follow/`, { following: userId })
    .then((response) => response.data);

export const unfollowApi = (userId: number) =>
  axiosAPI
    .post(`${rootUrl}/unfollow/`, { following: userId })
    .then((response) => response.data);
