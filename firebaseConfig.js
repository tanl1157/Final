// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCzck4Onru5Sz2jwdBhpRaIsnaXLFYKH4s",
  authDomain: "foodapp2-3b519.firebaseapp.com",
  projectId: "foodapp2-3b519",
  storageBucket: "foodapp2-3b519.appspot.com",
  messagingSenderId: "1094564375283",
  appId: "1:1094564375283:android:10d3903867e764107ea586",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {storage, db, auth};
