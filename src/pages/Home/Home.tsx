import { Link } from "react-router-dom";
import { FitCoinState } from "../../store";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";

function Home() {
  const userInfo = useSelector((state: FitCoinState) => state.userReducer);

  const auth = getAuth();

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      {!userInfo.isLoggedIn && (
        <Link to="/login">
          <button className="btn btn-primary">Go to Login</button>
        </Link>
      )}
      {userInfo.isLoggedIn && (
        <div>
          <h1>{`Welcome, ${userInfo.firstName} ${userInfo.lastName}!`}</h1>
          <button className="btn btn-danger" onClick={signOutUser}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
