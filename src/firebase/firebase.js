import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1_87hYE2-9rdsDhoYf2MkumiYt4-wfnY",
  authDomain: "splitwise-db6f6.firebaseapp.com",
  projectId: "splitwise-db6f6",
  storageBucket: "splitwise-db6f6.appspot.com",
  messagingSenderId: "1015439468184",
  appId: "1:1015439468184:web:a1f7838e2d0d60aafa12ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app)

export {auth, app, db}
