import { Link } from "react-router-dom";
import { FitCoinState } from "../../store";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./Home.css";
import "../../index.css";
import * as stravaClient from "../../Integrations/Strava/stravaClient";
import { FaStrava } from "react-icons/fa";

function Home() {
  const userInfo = useSelector((state: FitCoinState) => state.userReducer);
  const isLoggedIn = useSelector((state: FitCoinState) => state.userReducer.isLoggedIn);
  const authToken = useSelector((state: FitCoinState) => state.userReducer.authToken);
  const stravaId = useSelector((state: FitCoinState) => state.userReducer.stravaId);
  const [recentStravaData, setRecentStravaData] = useState<any>({
    recentActivities: [],
    nextRefresh: 0,
    coinsGained: 0,
  });

  useEffect(() => {
    const fetchStravaData = async () => {
      try {
        if (stravaId === "") {
          return;
        }
        const stravaData = await stravaClient.getRecentActivities(stravaId, authToken);
        setRecentStravaData(stravaData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchStravaData();
  }, [authToken, stravaId]);

  function activityDateString(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  }

  function nextRefreshDateString(epoch: number) {
    const date = new Date(epoch * 1000);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  function stravaActivity(activity: any) {
    return (
      <>
        <div className="activity-title-container">
          <div className="activity-title">
            <FaStrava className="strava-icon" /> {activity.activityName} - Your {activity.activityType} on {activityDateString(activity.activityStartDate)}
          </div>
          <div className="activity-title-coins">
            {`💰 FitCoins Earned: ${activity.coins}`}
          </div>
        </div>
        <div className="activity-subtitle">
          {`🏃 Distance: ${activity.distance} meters`}
        </div>
        <div className="activity-subtitle">
          {`⏱️ Active Time: ${activity.movingTime}`}
        </div>
        <div className="activity-subtitle">
          {`⛰️ Elevation: ${activity.elevation}`}
        </div>
      </>
    );
  }

  function homeContent(welcomeMessage: string, stravaData: any, isLoggedIn: boolean) {
    <div>
      <h3>{welcomeMessage}</h3>
      <h4>Activity Imports:</h4>
      {stravaId === "" && isLoggedIn &&
        <div>
          Connect to Strava in your profile to import activities and earn coins!
        </div>
      }
      {(stravaId !== "" || !isLoggedIn) &&
        <div>
          <ul className="strava-activities">
            {stravaData.recentActivities.map((activity: any, index: number) => {
              return (
                <li key={index}>
                  {stravaActivity(activity)}
                </li>
              )
            })}
          </ul>
          <div className="strava-summary">
            Total FitCoins earned on this import: {stravaData.coinsGained} <br />
            Next Strava refresh: {nextRefreshDateString(stravaData.nextRefresh)}
          </div>
        </div>
      }
      {!isLoggedIn && <div>Log in to start earning FitCoins!</div>}
    </div>
  }

  return (
    <div>
      <h1 className="header-text">Home</h1>
      {!isLoggedIn &&
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
      }
    </div>
  );
}

export default Home;