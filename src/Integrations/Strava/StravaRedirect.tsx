import { Navigate } from "react-router";
import { FitCoinState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import "./Strava.css";
import * as stravaClient from "./stravaClient";
import { setStravaId } from "../../pages/Login/userReducer";
import { useEffect } from "react";

// Component is used for updating the Redux store with the Strava info
// before we redirect the user back to the home page.
function StravaRedirect() {
  const stravaId = useSelector((state: FitCoinState) => state.userReducer.stravaId);
  const userId = useSelector((state: FitCoinState) => state.userReducer.userId);
  const authToken = useSelector((state: FitCoinState) => state.userReducer.authToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStravaId = async () => {
      try {
        const response = await stravaClient.getStravaId(userId, authToken);
        const stravaId = response.stravaId;
        dispatch(setStravaId(stravaId));
      } catch {
        console.log("No StravaId found for user, navigating back to Home.");
        navigate("/home", { replace: true });
      }
    }

    fetchStravaId();
  }, [authToken, dispatch, navigate, userId]);


  if (stravaId !== "") {
    return <Navigate to="/home" replace />;
  } else {
    return (
      <div className="strava-wrapper">
        <h1 className="strava-header">Strava Profile</h1>
        <div className="button-wrapper">
          <p>Connecting to Strava...</p>
        </div>
      </div>
    );
  }
}

export default StravaRedirect;
