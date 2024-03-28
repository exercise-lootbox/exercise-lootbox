import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Login/userReducer";

export interface FitCoinState {
  userReducer: {
    isLoggedIn: boolean;
    authToken: string;
    userId: string;
    firstName: string;
    lastName: string;
    dob: Date | undefined;
    role: string;
    stravaId: string;
  };
}
const store = configureStore({
  reducer: {
    userReducer,
  },
});

export default store;
