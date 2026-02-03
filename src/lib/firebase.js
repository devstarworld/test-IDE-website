// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLWyPPFDbQYMF4Oev8S8pXLN9oBjvIu8E",
  authDomain: "free-simple-ide-web-server.firebaseapp.com",
  projectId: "free-simple-ide-web-server",
  storageBucket: "free-simple-ide-web-server.firebasestorage.app",
  messagingSenderId: "247597304761",
  appId: "1:247597304761:web:3d90917911465dfae74468",
  measurementId: "G-TD12XV0TR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };