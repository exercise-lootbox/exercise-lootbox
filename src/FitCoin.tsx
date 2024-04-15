import "./App.css";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Details from "./pages/Details";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  setAuthToken,
  setUserId,
  setUser,
  resetUser,
  setStravaId,
  setStravaData,
} from "./pages/Login/userReducer";
import StravaConnect from "./Integrations/Strava";
import * as userClient from "./pages/Login/userClient";
import * as stravaClient from "./strava/stravaClient";
import UserProfile from "./pages/Profile/UserProfile";

function FitCoin() {
  const auth = getAuth();
  const dispatch = useDispatch();

  // Listen for auth state changes throughout entire app
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      const userId = user.uid;
      dispatch(setAuthToken(token));
      dispatch(setUserId(userId));

      /*Get the user's info from our database.
      Note: This could fail upon signup due to a race condition,
      so we fail silently here. In the event of a race condition,
      Login.tsx will handle updating the user state.*/
      try {
        const userDb = await userClient.getUser(userId, token);
        dispatch(setUser(userDb));
        if (userDb.stravaId) {
          const strava = await stravaClient.getStravaUser(userId, token);
          dispatch(setStravaData(strava));
          dispatch(setStravaId(userDb.stravaId));
        }
      } catch {
        console.error("User not found in database");
      }
    } else {
      console.log("User logged out");
      dispatch(resetUser());
    }
  });

  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/integrations/strava" element={<StravaConnect />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:uid" element={<UserProfile />} />
          <Route path="/details/:did" element={<Details />} />
          <Route path="/#/*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default FitCoin;
