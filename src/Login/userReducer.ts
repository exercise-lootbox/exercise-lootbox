import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  authToken: undefined,
  // TODO: more user info once we have DB set up
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
  },
});

export const { setAuthToken } = userSlice.actions;

export default userSlice.reducer;
