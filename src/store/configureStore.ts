import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "../pages/Login/userReducer";

export interface FitCoinState {
  persistedReducer: {
    isLoggedIn: boolean;
    authToken: string;
    userId: string;
    firstName: string;
    lastName: string;
    dob: Date | undefined;
    role: string;
    stravaId: string;
    coins: number;
    adminId: string | undefined;
    actingAsAdmin: boolean;
  };
}

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export default function configStore() {
  const store = configureStore({
    reducer: {
      persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
}
