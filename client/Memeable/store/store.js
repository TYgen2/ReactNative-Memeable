import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import postReducer from "./features/post/postSlice";
import interactionReducer from "./features/interaction/interactionSlice";
import storage from "@react-native-async-storage/async-storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persisConfig = {
  key: "root",
  storage,
  blacklist: ["post"],
  version: 1,
};

const reducer = combineReducers({
  user: userReducer,
  post: postReducer,
  interaction: interactionReducer,
});

const persistedReducer = persistReducer(persisConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
