import axios from "axios";
import { LOCAL_HOST } from "@env";
import { getTokens, storeTokens } from "./tokenActions";

const apiClient = axios.create({
  baseURL: `${LOCAL_HOST}/api`,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const { jwtToken, refreshToken } = await getTokens();

    // send the request with tokens included in headers automatically
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
      config.headers["x-refresh-token"] = refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  // If jwtToken is expired but refreshToken is still valid,
  // proceed to update the tokens and then return the response
  async (response) => {
    const newToken = response.headers["x-new-token"];
    const newRefreshToken = response.headers["x-new-refresh-token"];

    if (newToken && newRefreshToken) {
      console.log("New tokens received!! Storing in keychain...");
      await storeTokens(newToken, newRefreshToken);
    }

    // If tokens are still valid, return the response normally
    return response;
  },
  async (error) => {
    // Both tokens are expired, return to auth page
    if (error.response.status === 401) {
      console.log("Both tokens expired!! Returning to the login page...");
    }
    if (error.response.status === 404) {
      console.log("User not found, refreshToken GGed");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
