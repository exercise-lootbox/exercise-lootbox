import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { useSelector } from "react-redux";
import * as adminClient from "../Admin/adminClient";
import { errorToast, successToast } from "./toasts";

export default function AdminResult({ result }: { result: any }) {
  const authToken = useSelector(
    (state: any) => state.persistedReducer.authToken,
  );
  const adminId = useSelector(
    (state: any) => state.persistedReducer.adminId,
  );
  const [balance, setBalance] = useState(result.coins);
  const [isEditing, setIsEditing] = useState(false);
  const [preEditBalance, setPreEditBalance] = useState(result.coins);
  const [isAdmin, setIsAdmin] = useState(result.adminId !== undefined);

  const handleEditBalanceClicked = () => {
    setPreEditBalance(balance);
    setIsEditing(true);
  }

  const handleBalanceCancel = () => {
    setBalance(preEditBalance);
    setIsEditing(false);
  }

  const handleBalanceSave = async () => {
    try {
      await adminClient.updateUserCoins(adminId, result._id, balance, authToken);
      setIsEditing(false);
      successToast("Balance updated successfully")
    } catch (error: any) {
      errorToast("Failed to update balance. Please try again later.");
      console.error(error.message);
    }
    setIsEditing(false);
  }

  const handleAdminToggle = async (userId: string) => {
    try {
      if (!adminId) {
        throw new Error("Admin ID not found");
      }
      if (isAdmin) {
        await adminClient.deleteAdmin(adminId, userId, authToken);
      } else {
        await adminClient.createAdmin(adminId, userId, authToken);
      }
      setIsAdmin(!isAdmin);
      successToast("Admin status updated successfully");
    } catch (error: any) {
      errorToast("Failed to update admin status. Please try again later.");
      console.error(error.message);
    }
  }

  const handleResetStravaSync = async () => {
    try {
      await adminClient.resetUserStravaSync(adminId, result._id, authToken);
      successToast("Strava sync reset successfully");
    } catch (error: any) {
      errorToast("Failed to reset Strava sync. Please try again later.");
      console.error(error.message);
    }
  }

  return (
    <div key={result._id} className="user-search-result">
      <div className="user-name-title mb-1">
        <div>
          {result.firstName} {result.lastName}
        </div>
        ✉️ {result.email}
      </div>
      <div className="admin-row mb-1">
        <Form.Switch
          type="switch"
          className="admin-switch"
          id="admin-switch"
          label={isAdmin ? "Admin" : "Not an Admin"}
          checked={isAdmin}
          onChange={() => { handleAdminToggle(result._id) }}
        />
        <button className="button strava-button small-button" onClick={handleResetStravaSync}>
          Reset Strava Sync
        </button>
      </div>
      <div className="input-group">
        <span className="input-group-text">FitCoin Balance</span>
        <input
          type="number"
          className="form-control"
          placeholder="Enter Balance"
          value={balance}
          readOnly={!isEditing}
          onChange={(e) => setBalance(parseInt(e.target.value))}
        />
        {isEditing &&
          <>
            <button className="button secondary-button small-button" onClick={handleBalanceCancel}>
              Cancel
            </button>
            <button className="button primary-button small-button" onClick={handleBalanceSave}>
              Save
            </button>
          </>
        }
        {!isEditing &&
          <button className="button primary-button small-button" onClick={handleEditBalanceClicked}>
            Edit
          </button>
        }
      </div>
    </div>
  )
}