import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LOCAL_HOST } from "@env";

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async ({ jwtToken, refreshToken }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LOCAL_HOST}/api/fetchUserInfo`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      console.log("Global state updated using REDUX!!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const handleFollow = createAsyncThunk(
  "user/handleFollow",
  async ({ targetId, action, jwtToken, refreshToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${LOCAL_HOST}/api/handleFollow`,
        { targetId, action },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      console.log("Follow updated using REDUX!!");
      return { msg: response.data.msg };
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
