import React from "react";
import "./assets/App.css";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChatRoom from "./components/chat/ChatRoom";

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { getAuth, signInWithCustomToken } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBu7xPgVNo-L8BrllBwoExLOrpUujr3bYg",
  authDomain: "spotify-app-6636e.firebaseapp.com",
  projectId: "spotify-app-6636e",
  storageBucket: "spotify-app-6636e.appspot.com",
  messagingSenderId: "822048695604",
  appId: "1:822048695604:web:a90fbde36627cfb072b161",
  measurementId: "G-6NEQDG0QNF"
};
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// }

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 'URLSearchParams(window.location.search)' will get url string after the '?' & .get() will get the code value from the url
const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return (
    <ChatRoom db={db} />
    // <div className="app">
    //   {code ? <Dashboard code={code} /> : <Login />}
      
    // </div>
  );
}

export default App;
