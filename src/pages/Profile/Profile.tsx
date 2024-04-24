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

function Profile() {
  const { uid } = useParams();
  const auth = getAuth();
  const userId = useSelector((state: any) => state.persistedReducer.userId);
  const authToken = useSelector((state: any) => state.persistedReducer.authToken);
  const isLoggedIn = useSelector((state: any) => state.persistedReducer.isLoggedIn);
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
  });
  const [preEditProfile, setPreEditProfile] = useState<any>(userProfile);
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!isLoggedIn) {
          return;
        }
        if (!uid) {
          return await userClient.getUser(userId, authToken);
        } else {
          return await userClient.getOtherUser(uid);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    }

    fetchUserProfile().then((profile) => {
      setUserProfile(profile);
    });
  }, [authToken, uid, userId, isLoggedIn]);

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

  if (!uid && isLoggedIn) {
    return (
      <div>
        <div className="profile-header">
          <h1>Your Profile</h1>
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
        </div>

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
        <div>
          <hr />
          <h3>Integrations</h3>
          {userProfile.stravaId === "" && isLoggedIn &&
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
        <div>
          <hr />
          <div className="inventory-title">
          <h3>Inventory</h3>
          <Coins coins={userProfile.coins} />
          </div>
        </div>
        <hr />
        <button className="button danger-button small-button mt-2" onClick={signOutUser}>
          Logout
        </button>
        <LoginModal
          show={showModal}
          handleClose={handleModalExit}
          authSucceeded={handleAuthSucceeded}
          authFailed={handleAuthFailed} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>User {uid}'s Profile</h1>
      </div>
    );
  }
}

export default Profile