import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../pages/Login/userReducer";

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
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}
const store = configureStore({
  reducer: {
    userReducer,
  },
});

export default store;
