import { Link } from "react-router-dom";
import { FitCoinState } from "../../store";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { extractTokenParameters } from "../../utils";
import { updateStravaId } from "../Login/userClient";
import useAccessToken from "../../strava/useAccessToken";
import { getAthlete } from "../../strava/stravaClient";

function Home() {
  const userInfo = useSelector((state: FitCoinState) => state.userReducer);

  const auth = getAuth();
  const accessToken = useAccessToken();
  const [athleteStats, setAthleteStats] = useState({} as any);

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const loadAthlete = async () => {
      if (userInfo.accessToken !== "") {
        console.log("Access Token:", accessToken);
        const athleteStats = await getAthlete(accessToken);
        console.log("Athlete Stats:", athleteStats);
        setAthleteStats(athleteStats);
      }
    };
    const postStravaUser = async () => {
      if (userInfo.isLoggedIn && userInfo.stravaId === "") {
        const url = window.location.pathname;
        if (!url.includes("stravaId")) return;
        const { stravaId, refreshToken, accessToken, expiresAt } =
          extractTokenParameters(url);
        window.location.pathname = "";
        if (stravaId && refreshToken && accessToken && expiresAt) {
          const stravaData = {
            stravaId,
            refreshToken: refreshToken,
            accessToken: accessToken,
            expiresAt: expiresAt,
          };
          try {
            await updateStravaId(userInfo.userId, stravaId, userInfo.authToken);
            await axios.post(
              `http://localhost:4000/api/strava/${userInfo.userId}`,
              stravaData,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.authToken}`,
                  "Content-Type": "application/json",
                },
              },
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
    };
    postStravaUser();
    loadAthlete();
  }, [
    accessToken,
    userInfo,
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
          {athleteStats && <div>ID: {athleteStats.id}</div>}
          {athleteStats && <div>First Name: {athleteStats.firstname}</div>}
          {athleteStats && (
            <img
              src={athleteStats.profile_medium}
              height={50}
              width={50}
              alt={athleteStats.firstName}
            />
          )}
          {athleteStats && <div>Last Name: {athleteStats.lastname}</div>}
        </div>
      )}
    </div>
  );
}

export default Home;
