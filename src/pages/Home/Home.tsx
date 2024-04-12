import { Link } from "react-router-dom";
import { FitCoinState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { extractTokenParameters } from "../../utils";
import axios from "axios";
import { setStravaId } from "../Login/userReducer";
import { getActivities } from "../../strava/stravaClient";

function Home() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: FitCoinState) => state.userReducer);

  const auth = getAuth();

  const signOutUser = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const getUserActivities = async () => {
      if (userInfo.isLoggedIn && userInfo.stravaId !== "") {
        try {
          const response = await getActivities();
          console.log("res", response);
        } catch (error) {
          console.error("errorrr", error);
        }
      }
    };
    const postStravaUser = async () => {
      if (userInfo.isLoggedIn && userInfo.stravaId === "") {
        const url = window.location.href;
        if (!url.includes("stravaId")) return;
        const tokenParams = extractTokenParameters(url);
        if (
          tokenParams.stravaId &&
          tokenParams.refreshToken &&
          tokenParams.accessToken &&
          tokenParams.expiresAt
        ) {
          const stravaData = {
            stravaId: tokenParams.stravaId,
            refreshToken: tokenParams.refreshToken,
            accessToken: tokenParams.accessToken,
            expiresAt: tokenParams.expiresAt,
          };
          try {
            const response = await axios.post(
              `http://localhost:4000/api/strava/${userInfo.userId}`,
              stravaData,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.authToken}`,
                  "Content-Type": "application/json",
                },
              },
            );
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
          const stravaId = tokenParams.stravaId;
          // Now set the user state in Redux to be easily accessed throughout the app
          dispatch(setStravaId(stravaId));
        }
      }
    };
    postStravaUser();
    getUserActivities();
  }, [
    dispatch,
    userInfo.authToken,
    userInfo.isLoggedIn,
    userInfo.stravaId,
    userInfo.userId,
  ]);

  return (
    <div>
      <h1>Home</h1>
      {!userInfo.isLoggedIn && (
        <Link to="/login">
          <button className="btn btn-primary">Go to Login</button>
        </Link>
      )}
      {userInfo.isLoggedIn && (
        <div>
          <h1>{`Welcome, ${userInfo.firstName} ${userInfo.lastName}!`}</h1>
          <button className="btn btn-danger" onClick={signOutUser}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
