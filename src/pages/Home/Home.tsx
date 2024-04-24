import { Link, useNavigate } from "react-router-dom";
import { FitCoinState } from "../../store/configureStore";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./Home.css";
import "../../index.css";
import * as stravaClient from "../../Integrations/Strava/stravaClient";
import StravaActivity from "../../components/StravaActivity";

function Home() {
  const userInfo = useSelector((state: FitCoinState) => state.persistedReducer);
  const isLoggedIn = useSelector(
    (state: FitCoinState) => state.persistedReducer.isLoggedIn,
  );
  const authToken = useSelector(
    (state: FitCoinState) => state.persistedReducer.authToken,
  );
  const stravaId = useSelector(
    (state: FitCoinState) => state.persistedReducer.stravaId,
  );
  const userId = useSelector(
    (state: FitCoinState) => state.persistedReducer.userId,
  );
  const adminId = useSelector(
    (state: FitCoinState) => state.persistedReducer.adminId,
  );
  const [recentStravaData, setRecentStravaData] = useState<any>({
    recentActivities: [],
    nextRefresh: 0,
    coinsGained: 0,
  });
  const navigate = useNavigate();

  const sampleStravaData: any = {
    recentActivities: [
      {
        activityName: "Morning Run",
        activityType: "Run",
        activityStartDate: new Date(),
        coins: 740,
        distance: 5000,
        movingTime: 1200,
        elevation: 100,
      },
      {
        activityName: "Afternoon Ride",
        activityType: "Ride",
        activityStartDate: new Date(),
        coins: 500,
        distance: 3200,
        movingTime: 640,
        elevation: 200,
      },
    ],
    nextRefresh: new Date().getTime() / 1000 + 86400,
    coinsGained: 1240,
  };

  useEffect(() => {
    const fetchStravaData = async () => {
      try {
        if (stravaId === "") {
          return;
        }
        const stravaData = await stravaClient.getRecentActivities(
          userId,
          authToken,
        );
        setRecentStravaData(stravaData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchStravaData();
  }, [authToken, stravaId, userId]);



  function nextRefreshDateString(epoch: number) {
    const date = new Date(epoch * 1000);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  const goToActivityDetails = (activityId: number) => {
    if (stravaId === "") {
      return; // The sample data has no details
    }
    navigate("/details/" + activityId, { replace: true })
  }

  function homeContent(stravaData: any) {
    return (
      <div>
        <h3>
          {isLoggedIn
            ? `Welcome back, ${userInfo.firstName}!`
            : "Welcome to FitCoin!"}
        </h3>
        <h4>Activity Imports:</h4>
        {stravaId === "" && isLoggedIn && (
          <div>
            Connect to Strava in your profile to import activities and earn
            coins!
          </div>
        )}
        {(stravaId !== "" || !isLoggedIn) && (
          <div>
            {!isLoggedIn && (
              <h4 className="sample-data-title">
                This is just sample data until you log in!
              </h4>
            )}
            <ul className="strava-activities">
              {stravaData.recentActivities.length === 0 &&
                <div className="empty-activity-title">
                  No activities imported yet today!{" "} <br />
                  {isLoggedIn && stravaId === "" && "Connect to Strava in your profile to start earning FitCoins!"}
                </div>}
              {stravaData.recentActivities.map(
                (activity: any, index: number) => {
                  return <li key={index}>
                    <StravaActivity activity={activity} isCurrentUserActivity={true} onClick={() => { goToActivityDetails(activity.id) }} />
                  </li>;
                },
              )}
            </ul>
            {
              stravaData.recentActivities.length > 0 &&
              <div className="strava-summary">
                Total FitCoins earned on this import: {stravaData.coinsGained}{" "}
                <br />
                Next Strava refresh:{" "}
                {nextRefreshDateString(stravaData.nextRefresh)}
              </div>
            }
          </div>
        )}
        {!isLoggedIn && (
          <div className="strava-summary">
            <Link to="/login">
              <button className="login-button mt-1">
                Log in to start earning FitCoins!
              </button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="header-text">Home</h1>
      {isLoggedIn && <div>{homeContent(recentStravaData)}</div>}
      {!isLoggedIn && <div>{homeContent(sampleStravaData)}</div>}
      {/* {!isLoggedIn &&
        <Link to="/login">
          <button className="btn btn-primary">Go to Login</button>
        </Link>
      }
      {isLoggedIn &&
        <div>
          <h3>{`Welcome back, ${userInfo.firstName}!`}</h3>
          <h4>Activity Imports:</h4>
          {stravaId === "" &&
            <div>
              Connect to Strava in your profile to import activities and earn coins!
            </div>
          }
          {stravaId !== "" &&
            <div>
              <ul className="strava-activities">
                {recentStravaData.recentActivities.map((activity: any, index: number) => {
                  return (
                    <li key={index}>
                      {stravaActivity(activity)}
                    </li>
                  )
                })}
              </ul>
              <div className="strava-summary">
                Total coins earned on this import: {recentStravaData.coinsGained} <br />
                Next Strava refresh: {nextRefreshDateString(recentStravaData.nextRefresh)}
              </div>
            </div>
          }
        </div>
      } */}
    </div>
  );
}

export default Home;
