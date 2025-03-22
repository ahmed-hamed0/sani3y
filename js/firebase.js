// تهيئة Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
  authDomain: "sani3ydotcom.firebaseapp.com",
  projectId: "sani3ydotcom",
  storageBucket: "sani3ydotcom.appspot.com",
  messagingSenderId: "880517005136",
  appId: "1:880517005136:web:e7f08efdadee45ec943655"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// جعل المتغيرات متاحة بشكل عام
window.auth = auth;
window.db = db;
