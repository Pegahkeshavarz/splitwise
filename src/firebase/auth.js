import {auth, db} from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {addDoc, collection} from "firebase/firestore";


export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  console.log('here')
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  if(result.user) {
    await addDoc(collection(db, "userData"), {email: result.user.email})
  }
  return result;
};

export const doSignOut = () => {
  return auth.signOut();
};
;