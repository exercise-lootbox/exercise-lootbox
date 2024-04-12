import store from "../store";

export function getUserIdAndAuthToken() {
  const state = store.getState();
  console.log("state", state);
  const userId = state.userReducer;
  console.log("userId", userId);
  const authToken = state.userReducer.authToken;
  return { userId, authToken };
}

export function extractTokenParameters(url: string) {
  const urlParams = new URLSearchParams(url.split("?")[1].split("#")[0]);

  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");
  const expiresAt = urlParams.get("expiresAt");
  const stravaId = urlParams.get("stravaId");

  return {
    accessToken,
    refreshToken,
    expiresAt,
    stravaId,
  };
}
