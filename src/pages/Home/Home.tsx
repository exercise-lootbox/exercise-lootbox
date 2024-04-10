import { Link } from "react-router-dom";
import { FitCoinState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { extractTokenParameters } from "../../utils";
import axios from "axios";

function Home() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: FitCoinState) => state.userReducer);
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
          type: "LOGIN",
          payload: {
            isLoggedIn: true,
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ")[1] || "",
          },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  useEffect(() => {
    const postStravaUser = async () => {
      if (userInfo.isLoggedIn) {
        const url = window.location.href;
        const tokenParams = extractTokenParameters(url);
        console.log(tokenParams);
        console.log(userInfo.userId);
        console.log(userInfo.authToken);
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
        }
      }
    };
    postStravaUser();
  }, [userInfo.authToken, userInfo.isLoggedIn, userInfo.userId]);

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
