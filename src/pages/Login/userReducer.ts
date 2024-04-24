import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isLoggedIn: false,
  authToken: "",
  userId: "",
  firstName: "",
  lastName: "",
  dob: undefined,
  stravaId: "",
  coins: 0,
  adminId: undefined,
  actingAsAdmin: false,
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
      state.stravaId = "";
      state.coins = 0;
      state.adminId = undefined;
      state.actingAsAdmin = false;
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
      state.stravaId = action.payload.stravaId;
      state.coins = action.payload.coins;
      state.adminId = action.payload.adminId;
    },
    setStravaId: (state, action) => {
      state.stravaId = action.payload;
    },
    addCoins: (state, action) => {
      state.coins = state.coins + action.payload;
    },
    setActingAsAdmin: (state, action) => {
      state.actingAsAdmin = action.payload;
    },
  },
});

export const {
  resetUser,
  setAuthToken,
  setUserId,
  setUser,
  setStravaId,
  addCoins,
  setActingAsAdmin,
} = userSlice.actions;

export default userSlice.reducer;
