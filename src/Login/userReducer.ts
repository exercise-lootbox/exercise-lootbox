import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isLoggedIn: false,
  authToken: "",
  userId: "",
  stravaId: "",
  // TODO: more user info (name, etc.) once we have DB set up
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.isLoggedIn = false;
      state.authToken = "";
      state.userId = "";
      state.stravaId = "";
    },
    setAuthToken: (state, action) => {
      const token = action.payload;
      state.authToken = token;
      state.isLoggedIn = token !== "";
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setStravaId: (state, action) => {
      state.stravaId = action.payload;
    },
  },
});

export const { resetUser, setAuthToken, setUserId, setStravaId } =
  userSlice.actions;

export default userSlice.reducer;
