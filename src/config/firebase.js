import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_KOj-7uGK2MXcO0oJWkKoU1VGvuiAPsg",
  authDomain: "login-app-internship-b404b.firebaseapp.com",
  projectId: "login-app-internship-b404b",
  storageBucket: "login-app-internship-b404b.firebasestorage.app",
  messagingSenderId: "911775514796",
  appId: "1:911775514796:web:5f0ce309176cdac9245f09",
  measurementId: "G-ZCDB61R7VS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

