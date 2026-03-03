import firebase from "firebase/app";

import "firebase/firebase-analytics";
import "firebase/firebase-database";
import "firebase/firebase-functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_BASEURL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default {
  firebaseConfig,
};

export const LoadAnalytics = () => {
  firebase.analytics();
};

export const db = firebase.database();
// Initialize Cloud Functions through Firebase
export const functions = firebase.functions();
