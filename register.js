 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
 import { getAuth , createUserWithEmailAndPassword } from "firebase/auth";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
    authDomain: "sani3ydotcom.firebaseapp.com",
    projectId: "sani3ydotcom",
    storageBucket: "sani3ydotcom.firebasestorage.app",
    messagingSenderId: "880517005136",
    appId: "1:880517005136:web:89d6863a0f476395943655"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


// register.js

// إعداد Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// معالجة إرسال نموذج التسجيل
document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // التقاط القيم من الحقول
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const userType = document.getElementById('userType').value;
  const specialty = document.getElementById('specialty').value;

  // التحقق من الحقول
  if (!fullName || !email || !phone || !password || !userType) {
    alert('الرجاء ملء جميع الحقول المطلوبة');
    return;
  }

  // تسجيل المستخدم في Firebase
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // حفظ بيانات المستخدم في Firestore
      return firebase.firestore().collection('users').doc(user.uid).set({
        fullName: fullName,
        email: email,
        phone: phone,
        userType: userType,
        specialty: userType === 'craftsman' ? specialty : ''
      });
    })
    .then(() => {
      alert('تم إنشاء الحساب وتخزين البيانات بنجاح!');
      window.location.href = 'login.html'; // إعادة توجيه إلى صفحة تسجيل الدخول
    })
    .catch((error) => {
      alert('حدث خطأ أثناء التسجيل: ' + error.message);
    });
});

// إظهار أو إخفاء حقل التخصص بناءً على نوع المستخدم
document.getElementById('userType').addEventListener('change', function() {
  const specialtyGroup = document.getElementById('specialtyGroup');
  if (this.value === 'craftsman') {
    specialtyGroup.style.display = 'block';
  } else {
    specialtyGroup.style.display = 'none';
  }
});

// نجاح! الآن لديك سكريبت كامل للتسجيل متكامل مع Firebase 🎯

