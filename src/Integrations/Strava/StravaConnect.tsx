import { Navigate } from "react-router";
import { FitCoinState } from "../../store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Strava.css";

function StravaConnect() {
  const isLoggedIn = useSelector(
    (state: FitCoinState) => state.userReducer.isLoggedIn,
  );
  const stravaId = useSelector(
    (state: FitCoinState) => state.userReducer.stravaId,
  );

  const handleStravaConnect = async () => {
    window.location.href = "http://localhost:4000/api/strava/login";
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
