import React, { useEffect } from "react";
import { token } from "../../strava/stravaClient";

function Profile() {
  const [accessToken, setAccessToken] = React.useState("");

  useEffect(() => {
    setAccessToken(token);
    window.location.hash = "";
  }, []);

  return (
    <div>
      <h1>{accessToken ? `Current User's Profile` : `Connected to strava`}</h1>
    </div>
  );
}

export default Profile;
