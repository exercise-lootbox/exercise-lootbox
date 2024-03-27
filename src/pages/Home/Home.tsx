import { Link } from 'react-router-dom';
import { FitCoinState } from '../../store';
import { useSelector } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';

function Home() {
  const isLoggedIn = useSelector(
    (state: FitCoinState) => state.userReducer.isLoggedIn
  );
  const authToken = useSelector(
    (state: FitCoinState) => state.userReducer.authToken
  );
  const userId = useSelector((state: FitCoinState) => state.userReducer.userId);
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
      {!isLoggedIn && (
        <Link to="/login">
          <button className="btn btn-primary">Go to Login</button>
        </Link>
      )}
      <br />
      Is logged in: {isLoggedIn ? 'true' : 'false'}
      <br />
      Auth token: {authToken}
      <br />
      User ID: {userId}
      <br />
      {isLoggedIn && (
        <button className="btn btn-danger" onClick={signOutUser}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Home;
