import { SignInData, SignUpData } from "@/typing/entities";
import {
  axiosAPI,
  getRefreshToken,
  removeHeaders,
  setNewHeaders,
} from "@/utils";
import { API_SERVER } from "@/env";

export const signInApi = (payload: SignInData) =>
  axiosAPI
    .post(`${API_SERVER}/api/auth/token/obtain/`, payload)
    .then((response) => setNewHeaders(response));

export const signUpApi = (payload: SignUpData) =>
  axiosAPI.post(`${API_SERVER}/api/auth/sign_up/`, payload);

export const signOutApi = () =>
  axiosAPI
    .post(`${API_SERVER}/api/auth/token/blacklist/`, {
      refresh_token: getRefreshToken(),
    })
    .then(() => removeHeaders());
