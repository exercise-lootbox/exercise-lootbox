import { Link } from "react-router-dom";
import { FitCoinState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { extractTokenParameters } from "../../utils";
import axios from "axios";
import * as userClient from "../Login/userClient";
import { setStravaId } from "../Login/userReducer";

function Home() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: FitCoinState) => state.userReducer);
  console.log("ui", userInfo);
  // const isLoggedIn = useSelector(
  //   (state: FitCoinState) => state.userReducer.isLoggedIn,
  // );
  const [isLoading, setIsLoading] = useState(true);

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        dispatch({
          payload: {
            isLoggedIn: true,
          },
          type: "LOGIN",
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  useEffect(() => {
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
  }, [
    dispatch,
    userInfo.authToken,
    userInfo.isLoggedIn,
    userInfo.stravaId,
    userInfo.userId,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
