import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
  authDomain: "sani3ydotcom.firebaseapp.com",
  projectId: "sani3ydotcom",
  storageBucket: "sani3ydotcom.appspot.com",
  messagingSenderId: "880517005136",
  appId: "1:880517005136:web:e7f08efdadee45ec943655"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
