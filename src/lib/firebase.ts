// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCLWyPPFDbQYMF4Oev8S8pXLN9oBjvIu8E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "free-simple-ide-web-server.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "free-simple-ide-web-server",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "free-simple-ide-web-server.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "247597304761",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:247597304761:web:3d90917911465dfae74468",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-TD12XV0TR9"
};

// Initialize Firebase (avoid duplicate initialization)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services with proper typing
let analytics: Analytics | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  // Initialize Auth
  auth = getAuth(app);
  
  // Initialize Firestore with offline persistence
  db = getFirestore(app);
  
  // Initialize Storage
  storage = getStorage(app);
  
  // Initialize Analytics (only in browser)
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  
  console.log('Firebase initialized successfully');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Auth Domain:', firebaseConfig.authDomain);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, analytics, auth, db, storage };