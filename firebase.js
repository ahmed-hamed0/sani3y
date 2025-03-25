// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
  authDomain: "sani3ydotcom.firebaseapp.com",
  projectId: "sani3ydotcom",
  storageBucket: "sani3ydotcom.appspot.com",
  messagingSenderId: "880517005136",
  appId: "1:880517005136:web:e7f08efdadee45ec943655"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// جعل المتغيرات متاحة بشكل عام
window.auth = auth;
window.db = db;
