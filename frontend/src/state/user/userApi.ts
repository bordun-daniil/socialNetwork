import { axiosAPI } from "@/utils";
import { API_SERVER } from "@/env";

const rootUrl = API_SERVER + "/api/user/";

export const getUserDataApi = () =>
  axiosAPI.get(rootUrl).then((response) => response.data);

export const getOtherUserDataApi = (userId: number) =>
  axiosAPI.get(rootUrl + userId).then((response) => response.data);

export const findUserApi = (payload: string) =>
  axiosAPI
    .get(`${rootUrl}find_user/?search=${payload}`)
    .then((response) => response.data);

export const editUserApi = (payload: FormData) =>
  axiosAPI.patch(`${rootUrl}`, payload).then((response) => response.data);
