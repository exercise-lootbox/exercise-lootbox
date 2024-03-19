import './App.css';
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router"
import Profile from './Profile';
import Search from './Search';
import Details from './Details';
import Home from './Home';
import Login from './Login';

function App() {
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

export default App;
