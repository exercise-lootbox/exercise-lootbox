import { useDispatch } from 'react-redux'
import { setAuthToken } from './userReducer';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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
    <div>
      <h1>Login</h1>
    </div>
  );
}

export default Login;
