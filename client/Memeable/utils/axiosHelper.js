import axios from "axios";
import { setGlobalConfig } from "axios-logger";
import { clearTokens, getTokens, storeTokens } from "./tokenActions";
import { ToastAndroid } from "react-native";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

setGlobalConfig({
  dateFormat: "HH:mm:ss",
  status: true,
  headers: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const { jwtToken, refreshToken } = await getTokens();

    // send the request with tokens included in headers automatically
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    if (refreshToken) {
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
      const { jwtToken, refreshToken } = await getTokens();

      if (newToken !== jwtToken || newRefreshToken !== refreshToken) {
        console.log("New tokens received!! Storing in keychain...");
        await storeTokens(newToken, newRefreshToken);
      }
    }

    // If tokens are still valid, return the response normally
    return response;
  },
  async (error) => {
    // Log the complete error for debugging
    console.error("API Error:", {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config,
    });

    // Handle cases where response doesn't exist
    if (!error.response) {
      console.error("Network error or no response from server");
      ToastAndroid.show(
        "Network error or no response from server",
        ToastAndroid.LONG
      );
      return Promise.reject({
        response: {
          data: { msg: "Network error or no response from server" },
        },
      });
    }

    // Handle authentication errors
    if (error.response.status === 401) {
      console.log("Both tokens expired!! Returning to the login page...");
      await clearTokens();
    }

    if (error.response.status === 404) {
      console.log("User not found, refreshToken GGed");
      await clearTokens();
    }

    // Always return a properly structured error
    return Promise.reject(error);
  }
);

// Also add some configuration for file uploads
apiClient.defaults.timeout = 10000; // 30 seconds timeout
apiClient.defaults.maxContentLength = Infinity;
apiClient.defaults.maxBodyLength = Infinity;

export default apiClient;
