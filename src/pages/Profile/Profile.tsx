import { useParams } from "react-router";
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from "react-router";

function Profile() {
  const { uid } = useParams();
  const auth = getAuth();
  const navigate = useNavigate();

  const signOutUser = async () => {
    try {
      await signOut(auth);
      navigate("/home", { replace: true });
    } catch (error: any) {
      console.error(error.message)
    }
  }

  if (!uid) {
    return (
      <div>
        <h1>Current User's Profile</h1>
        <button className="btn btn-danger" onClick={signOutUser}>
          Logout
        </button>
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