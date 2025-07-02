// src/lib/firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "plateforme-pos",
  storageBucket: "plateforme-pos.firebasestorage.app",
  messagingSenderId: "857681987317",
  appId: "1:857681987317:web:5e0b3707c92dc4dba367bc",
  measurementId: "G-GHPERVNSPM"
};

const app = initializeApp(firebaseConfig);

export default app;