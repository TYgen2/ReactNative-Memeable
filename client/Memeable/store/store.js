import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import tokenReducer from "./tokenReducer";
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
  version: 1,
};

const reducer = combineReducers({
  user: userReducer,
  token: tokenReducer,
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
