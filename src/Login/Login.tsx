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

  return (
    <div className="fc-login-container">
      <div className="fc-login-background d-none d-sm-block">
        <h1>Logo Here</h1>
        <h2>Welcome to FitCoin 💪</h2>
      </div>
      <div className="fc-login-form shadow pt-2">
        <div className="fc-login-form-title">
          <h1>Sign In</h1>
        </div>
        {/* form-group?? */}
        <input type="text" className="form-control" />
      </div>
    </div>
  );
}

export default Login;
