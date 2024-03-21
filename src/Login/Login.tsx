import { useDispatch } from 'react-redux'
import { setAuthToken } from './userReducer';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import "./Login.css";
import "../index.css"

function Login() {
  // TODO: add form elements for other user info once we have DB set up
  const auth = getAuth()
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // The onAuthStateChanged listener should handle updating the user
  // state once it detects the user has been signed in
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error signing in:", error.message);
    }
  }

  const handleCreateAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error creating account:", error.message);
    }
  }

  function emailAndPassword(): JSX.Element {
    return (
      <div>
        <div className="form-group mb-2">
          <label className="fw-bold" htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" placeholder="Enter email" />
        </div>
        <div className="form-group mb-2">
          <label className="fw-bold" htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Enter password" />
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
          <div className="form-group mb-2">
            <label className="fw-bold" htmlFor="first-name">First name</label>
            <input type="text" className="form-control" id="first-name" placeholder="Enter first name" />
          </div>
          <div className="form-group mb-2">
            <label className="fw-bold" htmlFor="last-name">Last name</label>
            <input type="text" className="form-control" id="last-name" placeholder="Enter last name" />
          </div>
          {emailAndPassword()}
          <button className="btn btn-primary w-100" onClick={handleSignIn}>
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
          {emailAndPassword()}
          <button className="btn btn-primary w-100" onClick={handleCreateAccount}>
            Create Account
          </button>
          <p className="small fw-light mt-2 pt-1 mb-0">Already have an account?
            <button className="btn btn-link btn-sm pb-2" onClick={() => setIsSignIn(true)}>Sign in</button></p>
        </div>
      </div>);
  }

  return (
    <div className="row">
      <div className="col-lg-8 col-md-7 col-sm-6 d-none d-sm-block fc-login-background">
        <h1>[Logo Here]</h1>
        <h2>Welcome to FitCoin 💪</h2>
      </div>
      <div className="col-lg-4 col-md-5 col-sm-6 fc-login-form">
        {isSignIn ? loginForm() : registerForm()}
      </div>
    </div>
  );
}

export default Login;
