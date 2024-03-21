import { Navigate } from 'react-router';
import { FitCoinState } from "../../store";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

function StravaConnect() {
  const isLoggedIn = useSelector((state: FitCoinState) => state.userReducer.isLoggedIn);
  const stravaId = useSelector((state: FitCoinState) => state.userReducer.stravaId);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  } else if (stravaId !== "") {
    // If they already have a Strava account, redirect to the Home
    return <Navigate to="/home" replace />
  } else {
    return (
      <div>
        <h1>This is where we will connect to Strava</h1>
        <Link to="/home">
          <button className="btn btn-primary">Set up later in profile</button>
        </Link>
      </div>
    )
  }
}

export default StravaConnect;