import axios, { AxiosResponse, AxiosError } from "axios";
import { Comment } from "@/typing/entities";
import { API_SERVER } from "@/env";

export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const axiosAPI = axios.create({
  headers: {
    Authorization: "Bearer " + getAccessToken(),
  },
});

axiosAPI.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const originalRequest = error.config;
    const refreshUrl = API_SERVER + "/api/auth/token/refresh/";

    if (error.response) {
      if (error.response.status === 401 && originalRequest.url === refreshUrl) {
        window.location.href = "/sign_in/";
        return Promise.reject(error);
      }

      if (
        error.response.data.code === "token_not_valid" &&
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          const tokenParts: { exp: number } = JSON.parse(
            atob(refreshToken.split(".")[1])
          );

          const now: number = Math.ceil(Date.now() / 1000);

          if (tokenParts.exp > now) {
            return axiosAPI
              .post(refreshUrl, { refresh: refreshToken })
              .then((response: AxiosResponse) => {
                setNewHeaders(response);
                originalRequest.headers["Authorization"] =
                  "Bearer " + response.data.access;

                return axiosAPI(originalRequest);
              })
              .catch((error: AxiosError) => {
                console.log(error);
              });
          } else {
            console.log("Refresh token is expired", tokenParts.exp, now);
            window.location.href = "/sign_in/";
          }
        } else {
          console.log("Refresh token not available.");
          window.location.href = "/sign_in/";
        }
      }
    }

    return Promise.reject(error);
  }
);

export const setNewHeaders = (response: AxiosResponse) => {
  axiosAPI.defaults.headers["Authorization"] = "Bearer " + response.data.access;
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
};

export const removeHeaders = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  axiosAPI.defaults.headers["Authentication"] = undefined;
};

const findCommentInCommentsBranch = (
  branch: Comment,
  comment_id: number
): Comment | undefined => {
  if (comment_id === branch.id) return branch;
  else {
    for (let idx = 0; idx < branch.children.length; idx += 1) {
      let leave = branch.children[idx];
      let result = findCommentInCommentsBranch(leave, comment_id);
      if (result) return result;
    }
  }
};

export const findComment = (comments: Comment[], comment_id: number) => {
  for (let comment of comments) {
    var result = findCommentInCommentsBranch(comment, comment_id);
    if (result) return result;
  }
};
