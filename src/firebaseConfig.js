// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5NnffcjcTEBiCXcy-EEtttC8ntXzQzlg",
  authDomain: "tasks-bab33.firebaseapp.com",
  projectId: "tasks-bab33",
  storageBucket: "tasks-bab33.appspot.com",
  messagingSenderId: "78700856190",
  appId: "1:78700856190:web:c1d866b8a0dbb8d73c292f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };