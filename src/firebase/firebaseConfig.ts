import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBT9HG8xeEBm_K7426y_7J8JIx1fTLjNtI",
  authDomain: "reservas-sistemas.firebaseapp.com",
  projectId: "reservas-sistemas",
  storageBucket: "reservas-sistemas.appspot.com",
  messagingSenderId: "647290890053",
  appId: "1:647290890053:web:2f6a2f947821060c3a802c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
