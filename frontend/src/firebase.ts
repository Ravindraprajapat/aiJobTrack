import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "aijobtrack.firebaseapp.com",
  projectId: "aijobtrack",
  storageBucket: "aijobtrack.firebasestorage.app",
  messagingSenderId: "108298841769",
  appId: "1:108298841769:web:546db289605aaf7de383b8",
  measurementId: "G-MEJMXKQLTH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
