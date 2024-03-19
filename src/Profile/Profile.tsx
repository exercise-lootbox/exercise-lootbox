import { useParams } from "react-router";

function Profile() {
  const { uid } = useParams();

  if (!uid) {
    return (
      <div>
        <h1>Current User's Profile</h1>
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