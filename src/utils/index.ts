import firebase from "firebase/auth";
import store from "../store";

export function getHashParams() {
  const hashParams: any = {};
  let e;
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export async function getUserIdAndAuthToken() {
  // const authToken = await firebase.auth().currentUser.getIdToken()
  //Test
  const state = store.getState();
  console.log("state", state);
  const { userId, authToken } = state.userReducer; // Accessing userReducer key
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
