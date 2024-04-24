import "./App.css";
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
} from "./pages/Login/userReducer";
import StravaConnect from "./Integrations/Strava";
import * as userClient from "./pages/Login/userClient";
import StravaRedirect from "./Integrations/Strava/StravaRedirect";
import NavBar from "./pages/Navigation";
import "./FitCoin.css";
import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import useWindowGrew from "./hooks/useWindowGrew";
import { useLocation } from "react-router-dom";
import Shop from "./pages/Shop";
import ShopItems from "./pages/Shop/ShopItems";

function FitCoin() {
  const auth = getAuth();
  const dispatch = useDispatch();
  const [collapsedMenuOpen, setCollapsedMenuOpen] = useState(false);
  const location = useLocation();
  const [isOnLogin, setIsOnLogin] = useState(false);

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
      } catch {}
    } else {
      dispatch(resetUser());
    }
  });

  // Handles closing the collapsed menu when the window resizes
  useWindowGrew(() => {
    setCollapsedMenuOpen(false);
  });

  // Used to handle hiding the navbar on the login page
  useEffect(() => {
    setIsOnLogin(
      location.pathname.includes("/login") ||
        location.pathname.includes("/integrations"),
    );
  }, [location]);

  function routes() {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/integrations/strava" element={<StravaConnect />} />
        <Route
          path="/integrations/strava/redirect"
          element={<StravaRedirect />}
        />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:criteria" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:uid" element={<Profile />} />
        <Route path="/details/:did" element={<Details />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:lootboxId" element={<ShopItems />} />
      </Routes>
    );
  }

  return (
    <div className="d-flex">
      <div className={`d-none ${isOnLogin ? "" : "d-md-block"}`}>
        <NavBar closeAction={undefined} />
      </div>
      <div className={`${collapsedMenuOpen ? "d-block" : "d-none"}`}>
        <NavBar closeAction={() => setCollapsedMenuOpen(false)} />
      </div>
      <div
        className={`d-none ${isOnLogin ? "" : "d-md-block navbar-offset"}`}
      ></div>
      <div>
        <div
          className={`${isOnLogin ? "d-none" : "collapsed-navbar d-md-none"}`}
        >
          <button
            className="icon-button-accent"
            onClick={() => setCollapsedMenuOpen(!collapsedMenuOpen)}
          >
            <FaBars className="fs-3 ms-2" />
          </button>
        </div>
        <div
          className={`${
            isOnLogin
              ? "fitcoin-content-login"
              : "fitcoin-content d-none d-md-block"
          }`}
        >
          {routes()}
        </div>
        <div className="ms-2 me-2 d-md-none">{routes()}</div>
      </div>
    </div>
  );
}

export default FitCoin;
