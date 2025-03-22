
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
  authDomain: "sani3ydotcom.firebaseapp.com",
  projectId: "sani3ydotcom",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "880517005136",
  appId: "1:880517005136:web:e7f08efdadee45ec943655"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert('تم تسجيل الدخول بنجاح!');
      window.location.href = 'profile.html'; // Redirect to profile or another page
    })
    .catch((error) => {
      alert('حدث خطأ: ' + error.message);
    });
});

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// التحقق من المستخدم الحالي
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log("بيانات المستخدم:", userData);

      // توجيه المستخدم إلى الصفحة المناسبة
      if (userData.role === "client") {
        window.location.href = "clientProfile.html";
      } else if (userData.role === "worker") {
        window.location.href = "Profile.html";
      }
    } else {
      console.log("لم يتم العثور على بيانات المستخدم في Firestore");
    }
  } else {
    console.log("المستخدم غير مسجل دخول");
  }
});

import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // جلب بيانات المستخدم
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            alert("تم تسجيل الدخول بنجاح!");

            // توجيه المستخدم حسب نوع الحساب
            if (userData.role === "client") {
                window.location.href = "profile.html";
            } else {
                window.location.href = "profile.html";
            }
        }
    } catch (error) {
        alert("خطأ: " + error.message);
    }
}

// تصدير الدالة
window.loginUser = loginUser;

