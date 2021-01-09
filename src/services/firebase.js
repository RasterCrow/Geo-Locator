import firebase from "firebase/app";

import "firebase/firebase-analytics";
import "firebase/firebase-database";
import "firebase/firebase-functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_BASEURL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
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
