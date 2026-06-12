// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRZuQ_BN4dN7AGlV86hZup53EWL0I5JPo",
  authDomain: "gateguard-80cbe.firebaseapp.com",
  projectId: "gateguard-80cbe",
  storageBucket: "gateguard-80cbe.firebasestorage.app",
  messagingSenderId: "684593258085",
  appId: "1:684593258085:web:49f9ed0ce445d8cd96708c",
  measurementId: "G-DSX7Q7T526"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);