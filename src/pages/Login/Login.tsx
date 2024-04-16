import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FitCoinState } from "../../store";
import { useSelector } from "react-redux";
import "./Login.css";
import "../../index.css"
import { Navigate } from 'react-router';
import * as userClient from "./userClient";
import { useDispatch } from 'react-redux';
import { setUser } from './userReducer';

function Login() {
  const auth = getAuth()
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: FitCoinState) => state.userReducer.isLoggedIn);
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // The onAuthStateChanged listener should handle updating the user
  // state once it detects the user has been signed in
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authToken = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid;

      // Grab the user's info from our database
      const user = await userClient.getUser(userId, authToken);

      // Update user state in Redux
      dispatch(setUser(user));

    } catch (error: any) {
      console.error("Error signing in:", error.message);
      setIsError(true);
    }
  }

  const handleCreateAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Now create the user in our database using their Firebase ID
      const newUser = await userClient.createUser({
        _id: userId,
        firstName: firstName,
        lastName: lastName,
        dob: new Date(birthday)
      });

      // Now set the user state in Redux to be easily accessed throughout the app
      dispatch(setUser(newUser));

    } catch (error: any) {
      console.error("Error creating account:", error.message);
      setIsError(true);
    }
  }

  // Updates the submit button based on the current form state
  useEffect(() => {
    const validEmailAndPassword = email.length > 0 && password.length >= 8;
    if (isSignIn) {
      setSubmitButtonEnabled(validEmailAndPassword);
    } else {
      let enabled = validEmailAndPassword && firstName.length > 0 && lastName.length > 0 && birthday.length > 0;
      setSubmitButtonEnabled(enabled);
    }
  }, [email, password, firstName, lastName, birthday, isSignIn]);

  useEffect(() => {
    setIsError(false);
    if (isSignIn) {
      setErrorMessage("Invalid username or password. If you don't have an account, click Register above.");
    } else {
      setErrorMessage("Error creating account. If you already have an account, click Sign In above.");
    }
  }, [isSignIn]);

  function emailAndPassword(): JSX.Element {
    return (
      <div>
        <div className="form-group mb-2">
          <label className="fw-bold" htmlFor="email">Email address</label>
          <input value={email} type="email" className="form-control" id="email" placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group mb-2">
          <label className="fw-bold" htmlFor="password">Password</label>
          <input value={password} type="password" className="form-control" id="password" placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)} />
          {!isSignIn && (
            <small id="passwordHelp" className="form-text text-muted">Password must be at least 8 characters</small>
          )}
        </div>
      </div>
    )
  }

  function loginForm(): JSX.Element {
    return (
      <div>
        <div className="fc-login-form-title">
          <h2>Sign in</h2>
        </div>
        <div>
          {emailAndPassword()}
          <button className="btn btn-primary w-100" onClick={handleSignIn} disabled={!submitButtonEnabled}>
            Sign In
          </button>
          <p className="small fw-light mt-2 pt-1 mb-0">Don't have an account?
            <button className="btn btn-link btn-sm pb-2" onClick={() => setIsSignIn(false)}>Register</button></p>
        </div>
      </div>);
  }

  function registerForm(): JSX.Element {
    return (
      <div>
        <div className="fc-login-form-title">
          <h2>Register</h2>
        </div>
        <div>
          <div className="form-group mb-2">
            <label className="fw-bold" htmlFor="first-name">First name</label>
            <input value={firstName} type="text" className="form-control" id="first-name" placeholder="Enter first name"
              onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="fw-bold" htmlFor="last-name">Last name</label>
            <input value={lastName} type="text" className="form-control" id="last-name" placeholder="Enter last name"
              onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="fw-bold" htmlFor="birthday">Birthday</label>
            <input value={birthday} type="date" className="form-control" id="birthday" placeholder="Enter birthday"
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBirthday(e.target.value)} />
          </div>
          {emailAndPassword()}
          <button className="btn btn-primary w-100" onClick={handleCreateAccount} disabled={!submitButtonEnabled}>
            Create Account
          </button>
          <p className="small fw-light mt-2 pt-1 mb-0">Already have an account?
            <button className="btn btn-link btn-sm pb-2" onClick={() => setIsSignIn(true)}>Sign in</button></p>
        </div>
      </div>);
  }

  // Redirect the user to connect their Strava account
  if (isLoggedIn && !isSignIn) {
    return <Navigate to="/integrations/strava" replace />
  } else if (isLoggedIn) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="row">
      <div className="col-lg-8 col-md-7 col-sm-6 d-none d-sm-block fc-login-background">
        <h1>[Logo Here]</h1>
        <h2>Welcome to FitCoin 💪</h2>
      </div>
      <div className="col-lg-4 col-md-5 col-sm-6 fc-login-form">
        {isSignIn ? loginForm() : registerForm()}
        {isError && (
          <div className="alert alert-danger" role="alert">{errorMessage}</div>
        )}
      </div>
    </div>
  );
}

export default Login;
