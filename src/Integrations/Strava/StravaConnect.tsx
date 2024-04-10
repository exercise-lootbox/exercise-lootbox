import { Navigate } from "react-router";
import { FitCoinState } from "../../store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Strava.css";
import axios from "axios";

function StravaConnect() {
  const isLoggedIn = useSelector(
    (state: FitCoinState) => state.userReducer.isLoggedIn,
  );
  const stravaId = useSelector(
    (state: FitCoinState) => state.userReducer.stravaId,
  );

  const authToken = useSelector(
    (state: FitCoinState) => state.userReducer.authToken,
  );

  const handleStravaConnect = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/strava/login",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const error = response.data.error;

      if (error) {
        console.error("Error:", error);
        return;
      }

      const redirectUrl = response.data.redirectURL;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  } else if (stravaId !== "") {
    // If they already have a Strava account, redirect to the Home
    return <Navigate to="/home" replace />;
  } else {
    return (
      <div className="strava-wrapper">
        <h1 className="strava-header">Strava Profile</h1>
        <div className="button-wrapper">
          <button
            onClick={handleStravaConnect}
            id="strava-connect-link"
            className="btn-strava"
          >
            Connect To Strava
          </button>
          <p className="or">
            or <Link to="/home">Set up later in profile</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default StravaConnect;
