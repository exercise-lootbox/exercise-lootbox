import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isLoggedIn: false,
  authToken: "",
  userId: "",
  // TODO: more user info once we have DB set up
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      const token = action.payload;
      state.authToken = token;
      state.isLoggedIn = token !== "";
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    }
  },
});

export const { setAuthToken, setUserId } = userSlice.actions;

export default userSlice.reducer;

/*
TODO:
- Add user id to user reducer
- Add blank screen for strava connection
  - If not logged in, just redirect to normal login page
*/