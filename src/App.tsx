import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import FitCoin from "./FitCoin";
import { initializeApp } from "firebase/app";
import { HashRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import configStore from "./store/configureStore";

const { persistor, store } = configStore();

// Connect to Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <FitCoin />
          <ToastContainer />
        </HashRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
