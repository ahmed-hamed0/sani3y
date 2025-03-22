// استيراد Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// إعداد Firebase - ضع القيم من Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
  authDomain: "sani3ydotcom.firebaseapp.com",
  projectId: "sani3ydotcom",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "880517005136",
  appId: "1:880517005136:web:e7f08efdadee45ec943655"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
