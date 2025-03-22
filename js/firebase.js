// استيراد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
  authDomain: "sani3ydotcom.firebaseapp.com",
  projectId: "sani3ydotcom",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "880517005136",
  appId: "1:880517005136:web:e7f08efdadee45ec943655"
};

// تحميل مكتبات Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
