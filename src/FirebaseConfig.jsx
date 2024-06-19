import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjkE7TPXPe9H9QIHLPszi2y3B1SQINQY4",
  authDomain: "spinshare77.firebaseapp.com",
  projectId: "spinshare77",
  storageBucket: "spinshare77.appspot.com",
  messagingSenderId: "236121623030",
  appId: "1:236121623030:web:d94287d595d1fb7491dfd7",
  measurementId: "G-WKLWPDHP8V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
