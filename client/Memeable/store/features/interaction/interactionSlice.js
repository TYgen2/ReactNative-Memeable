import { createSlice } from "@reduxjs/toolkit";
import { handleLikePost, handleSavePost } from "../../actions/userActions";

const initialState = {
  interactions: {},
  lastUpdated: {},
};

export const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    cleanupInteractions: (state) => {
      const now = Date.now();
      const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

      Object.entries(state.lastUpdated).forEach(([postId, timestamp]) => {
        if (now - timestamp > MAX_AGE) {
          delete state.interactions[postId];
          delete state.lastUpdated[postId];
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleLikePost.fulfilled, (state, action) => {
        const { postId, likeAction, likes } = action.payload;

        if (!state.interactions[postId]) {
          state.interactions[postId] = {};
        }
        state.interactions[postId].hasLiked = likeAction === "like";
        state.interactions[postId].likes = likes;
        state.lastUpdated[postId] = Date.now();
      })
      .addCase(handleSavePost.fulfilled, (state, action) => {
        const { postId, saveAction } = action.payload;

        if (!state.interactions[postId]) {
          state.interactions[postId] = {};
        }
        state.interactions[postId].isSaved = saveAction === "save";
        state.lastUpdated[postId] = Date.now();
      });
  },
});

export const { cleanupInteractions } = interactionSlice.actions;
export default interactionSlice.reducer;
