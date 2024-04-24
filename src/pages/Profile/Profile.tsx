import { useParams } from "react-router";
import { getAuth, signOut, updateEmail } from 'firebase/auth';
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as userClient from "../Login/userClient";
import { setUser } from "../Login/userReducer";
import "./Profile.css"
import LoginModal from "../Login/LoginModal";
import { errorToast, successToast } from "../../components/toasts";
import "../../Integrations/Strava/Strava.css";
import { FaStrava } from "react-icons/fa";
import Coins from "../../components/Coins";
import * as stravaClient from "../../Integrations/Strava/stravaClient";
import * as adminClient from "../../Admin/adminClient";
import * as itemClient from "../Shop/itemClient";
import StravaActivity from "../../components/StravaActivity";
import AdminToggle from "../../components/AdminSwitch";
import { ItemInfo } from "../../types";
import { sortInventoryItems } from "../../utils";
import InventoryItem from "../../components/Items/InventoryItem";

function Profile() {
  const { uid } = useParams();
  const auth = getAuth();
  const userId = useSelector((state: any) => state.persistedReducer.userId);
  const authToken = useSelector((state: any) => state.persistedReducer.authToken);
  const isLoggedIn = useSelector((state: any) => state.persistedReducer.isLoggedIn);
  const adminId = useSelector((state: any) => state.persistedReducer.adminId);
  const actingAsAdmin = useSelector((state: any) => state.persistedReducer.actingAsAdmin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    dob: Date.now(),
    coins: 0,
    stravaId: "",
    adminId: undefined,
  });
  const [adminInfo, setAdminInfo] = useState<any>({
    adminSince: Date.now(),
    lastUpdate: Date.now(),
  });
  const [preEditProfile, setPreEditProfile] = useState<any>(userProfile);
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recentStravaData, setRecentStravaData] = useState<any>({
    recentActivities: [],
    nextRefresh: 0,
    coinsGained: 0,
  });
  const [mostRareItems, setMostRareItems] = useState<ItemInfo[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let user;
        if (!uid) {
          user = await userClient.getUser(userId, authToken);
        } else {
          user = await userClient.getOtherUser(uid);
        }
        setUserProfile(user);
      } catch (error: any) {
        console.error(error.message);
      }
    }
    const fetchStravaData = async () => {
      try {
        const stravaData = await stravaClient.getRecentActivities(
          uid || userId,
          authToken,
        );
        setRecentStravaData(stravaData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchAdminInfo = async () => {
      if (userProfile.adminId !== undefined && !uid) {
        const adminResponse = await adminClient.getAdmin(adminId, authToken);
        setAdminInfo(adminResponse);
      }
    }

    const fetchMostRareItems = async () => {
      try {
        const items = await userClient.getItems(uid ? uid : userId, authToken);
        const itemPromises = items.map((item: string) =>
          itemClient.getItem(item),
        );
        const fetchedItems = await Promise.all(itemPromises);
        // Only want the 5 most rare items max
        const sortedItems = sortInventoryItems(fetchedItems).slice(-5);
        setMostRareItems(sortedItems);
      } catch (error) {
        console.error("Error retrieving user items:", error);
      }
    };

    if (!isLoggedIn && !uid) {
      navigate("/login", { replace: true });
      return;
    }

    fetchUserProfile();
    fetchStravaData();
    fetchAdminInfo();
    fetchMostRareItems();
  }, [authToken, uid, userId, isLoggedIn, navigate, userProfile.adminId, adminId]);

  const handleEdit = () => {
    if (isEditing) {
      // Cancel the edits
      setUserProfile(preEditProfile);
      setIsEditing(false);
    } else {
      setPreEditProfile(userProfile);
      setIsEditing(true);
    }
  }

  const handleSave = async () => {
    try {
      // We wait to update the email until we confirm with Firebase
      const userProfileWithOldEmail = { ...userProfile, email: preEditProfile.email };
      await userClient.updateUser(userId, userProfileWithOldEmail, authToken);

      // Update the redux
      dispatch(setUser(userProfileWithOldEmail));
      setIsEditing(false);

      // If the email was updated, we need to reauthenticate with Firebase first
      if (emailUpdated) {
        setShowModal(true);
      } else {
        successToast("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  const handleModalExit = () => {
    setUserProfile({ ...userProfile, email: preEditProfile.email });
    setEmailUpdated(false);
    setShowModal(false);
  }

  const handleAuthFailed = () => {
    handleModalExit();
    errorToast("Failed to update email. Please try again later.");
  }

  const handleAuthSucceeded = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Update with Firebase then with our backend
        const updatedEmail = userProfile.email;
        await updateEmail(auth.currentUser, updatedEmail);
        await userClient.updateEmail(userId, updatedEmail, authToken);
        setUserProfile({ ...userProfile, email: updatedEmail });
        successToast("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error(error.message);
      setUserProfile({ ...userProfile, email: preEditProfile.email });
    } finally {
      setEmailUpdated(false);
      setShowModal(false);
    }
  }

  const handleConnectToStrava = () => {
    navigate("/integrations/strava", { replace: true });
  }

  const signOutUser = async () => {
    try {
      await signOut(auth);
      navigate("/home", { replace: true });
    } catch (error: any) {
      console.error(error.message)
    }
  }

  const goToActivityDetails = (activityId: number) => {
    const queryString = uid ? `?stravaId=${userProfile.stravaId}` : "";
    navigate("/details/" + activityId + queryString, { replace: true })
  }

  const goToInventory = () => {
    const additionalPath = uid ? `/${uid}` : "";
    navigate("/inventory" + additionalPath, { replace: true })
  }

  const editButtons: JSX.Element = (
    <div>
      {isEditing &&
        <button className={`button me-2 small-button primary-button`}
          onClick={handleSave}>
          Save
        </button>
      }
      <button className={`button small-button ${isEditing ? `secondary-button` : `primary-button`}`}
        onClick={handleEdit}>
        {isEditing ? "Cancel" : "Edit"}
      </button>
    </div>
  )

  const profileHeader: JSX.Element = (
    <div className="profile-header">
      {uid && <h1>{userProfile.firstName} {userProfile.lastName}'s Profile</h1>}
      {!uid && <h1>Your Profile</h1>}
      {!uid && editButtons}
    </div>
  );

  const userInfo: JSX.Element = (
    <div>
      <div className="form-group mb-2">
        <label className="fw-bold" htmlFor="first-name-profile">First name</label>
        <input value={userProfile.firstName}
          type="text"
          className="form-control"
          id="first-name-profile"
          placeholder="First name"
          disabled={!isEditing}
          onChange={(e) => setUserProfile({
            ...userProfile,
            firstName: e.target.value
          })} />
      </div>
      <div className="form-group mb-2">
        <label className="fw-bold" htmlFor="last-name-profile">Last name</label>
        <input value={userProfile.lastName}
          type="text"
          className="form-control"
          id="last-name-profile"
          placeholder="Last name"
          disabled={!isEditing}
          onChange={(e) => setUserProfile({
            ...userProfile,
            lastName: e.target.value
          })} />
      </div>
      {!uid &&
        <div>
          <div className="form-group mb-2">
            <label className="fw-bold" htmlFor="email-profile">Email</label>
            <input value={userProfile.email}
              type="text"
              className="form-control"
              id="email-profile"
              placeholder="Email"
              disabled={!isEditing}
              onChange={(e) => {
                setUserProfile({
                  ...userProfile,
                  email: e.target.value
                });
                setEmailUpdated(true);
              }} />
          </div>
          <div className="form-group mb-2">
            <label className="fw-bold" htmlFor="birthday-profile">Birthday</label>
            <input value={new Date(userProfile.dob).toISOString().split('T')[0]}
              type="date"
              className="form-control"
              id="birthday-profile"
              placeholder="Birthday"
              disabled={!isEditing}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setUserProfile({
                ...userProfile,
                dob: e.target.value
              })} />
          </div>
        </div>
      }
    </div>
  )

  const integrationInfo: JSX.Element = (
    <div>
      <h3>Integrations</h3>
      {userProfile.stravaId === "" && isLoggedIn && !uid &&
        <h6>
          <FaStrava className="strava-icon" />
          You have not yet connected to Strava
          <button className="ms-2 button strava-button small-button" onClick={handleConnectToStrava}>
            Connect Now!
          </button>
        </h6>
      }
      {userProfile.stravaId !== "" &&
        <div>
          <h6>
            <FaStrava className="strava-icon" />
            Connected to Strava!
          </h6>
        </div>
      }
    </div>
  )

  const inventoryInfo: JSX.Element = (
    <div>
      <div className="inventory-title">
        <h3>Inventory</h3>
        <Coins coins={userProfile.coins} />
      </div>
      {mostRareItems.length !== 0 &&
        <div>
          {(uid || !isLoggedIn) &&
            <h6>
              Here are {userProfile.firstName}'s most rare items!
            </h6>
          }
          {!uid &&
            <h6>
              Here are your most rare items!
            </h6>
          }
          <div className="items">
            {mostRareItems.map((item, index: number) => (
              <InventoryItem key={index} itemId={item._id} />
            ))}
          </div>
          <button className="button primary-button small-button" onClick={goToInventory}>
            View All
          </button>
        </div>
      }
      {mostRareItems.length === 0 &&
        <div>
          {(uid || !isLoggedIn) &&
            <h6>
              {userProfile.firstName} has no items yet.
            </h6>}
          {!uid &&
            <h6>
              You have no items yet. Head to the shop to buy some!
            </h6>
          }
        </div>
      }
    </div>
  )


  const recentActivities: JSX.Element = (
    <div>
      <h3>Recent Activities</h3>
      <ul className="strava-activities">
        {recentStravaData.recentActivities.length === 0 &&
          <div>
            {!uid &&
              <div>
                No activities completed in the past day! Get moving!
              </div>
            }
            {uid &&
              <div>
                {userProfile.firstName} has not completed any activities in the past day.
              </div>
            }
          </div>
        }
        {recentStravaData.recentActivities.map((activity: any, index: number) => {
          return <li key={index}>
            <StravaActivity activity={activity} isCurrentUserActivity={!uid} onClick={() => { goToActivityDetails(activity.id) }} />
          </li>;
        })}
      </ul>
    </div>
  )

  const adminProfile: JSX.Element = (
    <div>
      <h3>Admin Info</h3>
      <div>
        <h6>
          Admin since: {new Date(adminInfo.adminSince).toLocaleDateString()}
        </h6>
        <h6>
          {adminInfo.lastUpdate &&
            `Last admin update: ${new Date(adminInfo.lastUpdate).toLocaleDateString()}`}
        </h6>
      </div>
    </div>
  )

  return (
    <div>
      {profileHeader}
      {!uid && <AdminToggle />}
      {userInfo}
      <hr />
      {userProfile.adminId !== undefined && actingAsAdmin && !uid &&
        <div>
          {adminProfile}
        </div>
      }
      {(userProfile.adminId === undefined || !actingAsAdmin || uid) &&
        <div>
          {recentActivities}
          <hr />
          {integrationInfo}
          <hr />
          {inventoryInfo}
        </div>
      }

      {!uid &&
        <div>
          <hr />
          <button className="button danger-button small-button mt-2" onClick={signOutUser}>
            Logout
          </button>
        </div>
      }

      <LoginModal
        show={showModal}
        handleClose={handleModalExit}
        authSucceeded={handleAuthSucceeded}
        authFailed={handleAuthFailed} />
    </div>
  );
}

export default Profile