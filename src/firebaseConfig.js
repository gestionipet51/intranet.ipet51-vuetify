// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_ZkXPyUOecizerUZ61mUKDfgnmA1iqe0",
  authDomain: "intranetipet51-20049.firebaseapp.com",
  projectId: "intranetipet51-20049",
  storageBucket: "intranetipet51-20049.appspot.com",
  messagingSenderId: "911892646464",
  appId: "1:911892646464:web:62eff9e76cf00affd4ada5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };