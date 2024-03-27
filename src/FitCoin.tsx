import './App.css';
import { HashRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Details from './pages/Details';
import Home from './pages/Home';
import Login from './pages/Login';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setAuthToken, setUserId, resetUser } from './pages/Login/userReducer';
import StravaConnect from './Integrations/Strava';

function FitCoin() {
  const auth = getAuth();
  const dispatch = useDispatch();

  // Listen for auth state changes throughout entire app
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      dispatch(setAuthToken(token));
      dispatch(setUserId(user.uid));

      // TODO: Make calls to DB here for user info not stored in Firebase
      // (name, stravaId, etc.)
    } else {
      dispatch(resetUser());
    }
  });

  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/integrations/strava" element={<StravaConnect />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:uid" element={<Profile />} />
          <Route path="/details/:did" element={<Details />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default FitCoin;
