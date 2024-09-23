import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzC6LQLQgzhBKMazsn46Wj2gIm8YZ3ZKA",
  authDomain: "nwitter-reloaded-683ef.firebaseapp.com",
  projectId: "nwitter-reloaded-683ef",
  storageBucket: "nwitter-reloaded-683ef.appspot.com",
  messagingSenderId: "977003029287",
  appId: "1:977003029287:web:418eedb01178948ce27f02"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
