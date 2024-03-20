import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Login/userReducer";

export interface FitCoinState {
  userReducer: {
    authToken: string | undefined;
  };
}
const store = configureStore({
  reducer: {
    userReducer,
  },
});

export default store;
