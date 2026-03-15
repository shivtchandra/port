import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA6sKECMXSjr9sOD0GfoaKBz3EjujWOG5Q",
  authDomain: "portfolio-bd28a.firebaseapp.com",
  projectId: "portfolio-bd28a",
  storageBucket: "portfolio-bd28a.firebasestorage.app",
  messagingSenderId: "100790699482",
  appId: "1:100790699482:web:a4a08117638057c1552ce3",
  measurementId: "G-Y7F5NWKP0P"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Analytics is only supported in browser environments
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { app, db, analytics };
