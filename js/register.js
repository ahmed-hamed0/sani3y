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
  appId: "1:880517005136:web:e7f08efdadee45ec943655"
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

  // تحقق من الحقول المطلوبة
  if (!fullName || !email || !phone || !password || !userType) {
    alert('الرجاء ملء جميع الحقول المطلوبة');
    return;
  }

  // إظهار رسالة تحميل
  const submitButton = document.querySelector('#signupForm button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'جاري إنشاء الحساب...';

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save additional user data to Firestore
      return setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        phone: phone,
        userType: userType,
        specialty: userType === 'craftsman' ? specialty : ''
      });
    })
    .then(() => {
      // إخفاء رسالة التحميل
      submitButton.disabled = false;
      submitButton.textContent = 'إنشاء حساب';

      // عرض رسالة نجاح
      alert('تم إنشاء الحساب بنجاح!');

      // توجيه المستخدم إلى صفحة تسجيل الدخول
      window.location.href = 'login.html';
    })
    .catch((error) => {
      // إخفاء رسالة التحميل
      submitButton.disabled = false;
      submitButton.textContent = 'إنشاء حساب';

      // عرض رسالة خطأ مفصلة
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب: ';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage += 'البريد الإلكتروني مستخدم بالفعل.';
          break;
        case 'auth/invalid-email':
          errorMessage += 'البريد الإلكتروني غير صالح.';
          break;
        case 'auth/weak-password':
          errorMessage += 'كلمة المرور ضعيفة. يجب أن تحتوي على 6 أحرف على الأقل.';
          break;
        default:
          errorMessage += error.message;
      }
      alert(errorMessage);
    });
});
