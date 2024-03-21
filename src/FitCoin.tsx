import './App.css';
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router"
import Profile from './Profile';
import Search from './Search';
import Details from './Details';
import Home from './Home';
import Login from './Login';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setAuthToken, setUserId } from './Login/userReducer';

function FitCoin() {
  const auth = getAuth();
  const dispatch = useDispatch();

  // Listen for auth state changes throughout entire app
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      dispatch(setAuthToken(token))
      dispatch(setUserId(user.uid))

      // TODO: set any other user info once we have DB set up
    } else {
      dispatch(setAuthToken(""))
      dispatch(setUserId(""))
    }
  });


  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
