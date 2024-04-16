import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isLoggedIn: false,
  authToken: "",
  userId: "",
  firstName: "",
  lastName: "",
  dob: undefined,
  role: "USER",
  stravaId: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.isLoggedIn = false;
      state.authToken = "";
      state.userId = "";
      state.firstName = "";
      state.lastName = "";
      state.dob = undefined;
      state.role = "USER";
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
    setUser: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.dob = action.payload.dob;
      state.role = action.payload.role;
      state.stravaId = action.payload.stravaId;
    },
    setStravaId: (state, action) => {
      state.stravaId = action.payload;
    },
  },
});

export const { resetUser, setAuthToken, setUserId, setUser, setStravaId } =
  userSlice.actions;

export default userSlice.reducer;
