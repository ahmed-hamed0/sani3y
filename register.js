// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
  authDomain: "sani3ydotcom.firebaseapp.com",
  projectId: "sani3ydotcom",
  storageBucket: "sani3ydotcom.appspot.com",
  messagingSenderId: "880517005136",
  appId: "1:880517005136:web:89d6863a0f476395943655"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const userType = document.getElementById('userType').value;
  const specialty = document.getElementById('specialty').value;

  if (!fullName || !email || !phone || !password || !userType) {
    alert('الرجاء ملء جميع الحقول المطلوبة');
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save user data to Firestore
      return setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        phone: phone,
        userType: userType,
        specialty: userType === 'craftsman' ? specialty : ''
      });
    })
    .then(() => {
      alert('تم إنشاء الحساب وتخزين البيانات بنجاح!');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      alert('حدث خطأ أثناء التسجيل: ' + error.message);
    });
});

// Show/hide specialty field based on user type
document.getElementById('userType').addEventListener('change', function() {
  const specialtyGroup = document.getElementById('specialtyGroup');
  specialtyGroup.style.display = this.value === 'craftsman' ? 'block' : 'none';
});
