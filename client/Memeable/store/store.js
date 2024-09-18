import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
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
import postReducer from "./postReducer";

const persisConfig = {
  key: "root",
  storage,
  blacklist: ["post"],
  version: 1,
};

const reducer = combineReducers({
  user: userReducer,
  post: postReducer,
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
