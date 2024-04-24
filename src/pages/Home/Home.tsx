import { Link, useNavigate } from "react-router-dom";
import { FitCoinState } from "../../store/configureStore";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./Home.css";
import "../../index.css";
import * as stravaClient from "../../Integrations/Strava/stravaClient";
import * as homeClient from "./homeClient";
import * as adminClient from "../../Admin/adminClient";
import StravaActivity from "../../components/StravaActivity";
import { showAdminContent } from "../../utils";

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
  const actingAsAdmin = useSelector(
    (state: FitCoinState) => state.persistedReducer.actingAsAdmin,
  );
  const [recentStravaData, setRecentStravaData] = useState<any>({
    recentActivities: [],
    nextRefresh: 0,
    coinsGained: 0,
  });
  const navigate = useNavigate();
  const [memberSpotlight, setMemberSpotlight] = useState<any>([]);
  const adminActive = showAdminContent(adminId, actingAsAdmin);
  const [adminInfo, setAdminInfo] = useState<any>({
    adminSince: Date.now(),
    lastUpdate: Date.now(),
  });

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

    const fetchMemberSpotlight = async () => {
      try {
        const spotlight = await homeClient.getMemberSpotlight();
        setMemberSpotlight(spotlight);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    const fetchAdminInfo = async () => {
      if (adminId !== undefined) {
        const adminResponse = await adminClient.getAdmin(adminId, authToken);
        setAdminInfo(adminResponse);
      }
    }

    fetchStravaData();
    fetchMemberSpotlight();
    fetchAdminInfo();
  }, [adminId, authToken, stravaId, userId]);



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

  const goToProfile = (userId: string) => {
    navigate("/profile/" + userId, { replace: true });
  }

  function spotlightItem(member: any): JSX.Element {
    return (
      <div className="member-spotlight-content">
        ⭐️ {member.firstName} {member.lastName} just earned {member.coinsEarned} FitCoins!
        <div>
        </div>
        <button className="button primary-button small-button" onClick={() => { goToProfile(member.userId) }}>
          Go to profile
        </button>
      </div>
    );
  }

  const spotlight: JSX.Element = (
    <div>
      <hr />
      <h4>Member Spotlight:</h4>
      <ul className="member-spotlight">
        {memberSpotlight.map((member: any, index: number) => {
          return (
            <li key={index}>
              {spotlightItem(member)}
            </li>
          );
        })}
      </ul>
    </div>
  )

  const adminHomeContent: JSX.Element = (
    <div>
      <h3>
        🔎 {userInfo.firstName}'s Admin Home
      </h3>
      <div className="admin-content">
        <h6>
          Admin since: {new Date(adminInfo.adminSince).toLocaleDateString()}
        </h6>
        <h6>
          {adminInfo.lastUpdate &&
            `Last admin update: ${new Date(adminInfo.lastUpdate).toLocaleDateString()}`}
        </h6>
        <div className="admin-accent">
          Please use the sidebar on the left to complete admin actions.
        </div>
      </div>
    </div>
  )

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
        {spotlight}
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
      {isLoggedIn &&
        <div>
          {adminActive &&
            <div>
              {adminHomeContent}
            </div>}
          {!adminActive &&
            <div>
              {homeContent(recentStravaData)}
            </div>
          }
        </div>
      }
      {!isLoggedIn && <div>{homeContent(sampleStravaData)}</div>}
    </div>
  );
}

export default Home;
