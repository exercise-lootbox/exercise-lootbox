import './App.css';
import store from "./store";
import { Provider } from "react-redux";
import FitCoin from './FitCoin';
import { initializeApp } from "firebase/app";

// Connect to Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

initializeApp(firebaseConfig);

function App() {
  return (
    <Provider store={store}>
      <FitCoin />
    </Provider>
  );
}

export default App;
