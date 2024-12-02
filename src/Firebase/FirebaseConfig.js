
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzck4Onru5Sz2jwdBhpRaIsnaXLFYKH4s",
  authDomain: "foodapp2-3b519.firebaseapp.com",
  projectId: "foodapp2-3b519",
  storageBucket: "foodapp2-3b519.firebasestorage.app",
  messagingSenderId: "1094564375283",
  appId: "1:1094564375283:web:8d7c468fba60b2237ea586"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage};