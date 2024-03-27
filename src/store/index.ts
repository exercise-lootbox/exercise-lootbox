import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../pages/Login/userReducer';

export interface FitCoinState {
  userReducer: {
    isLoggedIn: boolean;
    authToken: string;
    userId: string;
    stravaId: string;
  };
}
const store = configureStore({
  reducer: {
    userReducer
  }
});

export default store;
