import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXNQAzdPVFMQYF1Tn1DVhpqz9TV4S5e08",
  authDomain: "applifting-excercise.firebaseapp.com",
  projectId: "applifting-excercise",
  storageBucket: "applifting-excercise.appspot.com",
  messagingSenderId: "637778077421",
  appId: "1:637778077421:web:c8af08c6009951ed2b0ee4",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

export { app, db, auth, storage };
