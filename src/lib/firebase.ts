import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase web API keys are publishable by design — protected by Security Rules.
// Replace the apiKey below with your real key from Firebase Console → Project Settings.
const firebaseConfig = {
  apiKey: "AIzaSyDOqVp6Z4mnzqTg5Rhb2k8-ZlojPBJKC18",
  authDomain: "the-function-junction-83802.firebaseapp.com",
  projectId: "the-function-junction-83802",
  storageBucket: "the-function-junction-83802.firebasestorage.app",
  messagingSenderId: "14605515228",
  appId: "1:14605515228:web:6b4b49f11a270c15b8b719",
  measurementId: "G-MQJW0Y87EL",
};

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
