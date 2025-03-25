// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
  authDomain: "sani3ydotcom.firebaseapp.com",
  projectId: "sani3ydotcom",
  storageBucket: "sani3ydotcom.appspot.com", // تم تصحيح هذا الحقل
  messagingSenderId: "880517005136",
  appId: "1:880517005136:web:e7f08efdadee45ec943655"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// DOM Elements
const signupForm = document.getElementById('signupForm');
const userTypeSelect = document.getElementById('userType');
const specialtyGroup = document.getElementById('specialtyGroup');

// عرض/إخفاء حقل التخصص بناءً على نوع المستخدم
userTypeSelect.addEventListener('change', function() {
  specialtyGroup.style.display = this.value === 'worker' ? 'block' : 'none';
});

// معالجة إرسال النموذج
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // جمع بيانات النموذج
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const userType = userTypeSelect.value;
  const specialty = userType === 'worker' ? document.getElementById('specialty').value : '';
  const governorate = document.getElementById('governorate').value;
  const city = document.getElementById('city').value;

  // التحقق من صحة البيانات
  if (!validateForm(fullName, email, phone, password, governorate, city, userType, specialty)) {
    return;
  }

  try {
    // إنشاء المستخدم في Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // حفظ بيانات المستخدم الإضافية في Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      phone,
      userType,
      specialty,
      governorate,
      city,
      createdAt: new Date(),
      profileCompleted: false,
      rating: userType === 'worker' ? 0 : null,
      jobsCompleted: userType === 'worker' ? 0 : null
    });

    // توجيه المستخدم بناءً على نوعه
    if (userType === 'worker') {
      alert('تم تسجيل حسابك بنجاح! يرجى إكمال ملفك الشخصي.');
      window.location.href = 'complete-profile.html';
    } else {
      alert('تم تسجيل حسابك بنجاح!');
      window.location.href = 'profile.html';
    }
  } catch (error) {
    handleSignupError(error);
  }
});

// وظيفة التحقق من صحة البيانات
function validateForm(fullName, email, phone, password, governorate, city, userType, specialty) {
  if (!fullName || !email || !phone || !password || !governorate || !city) {
    alert('الرجاء ملء جميع الحقول المطلوبة');
    return false;
  }

  if (userType === 'worker' && !specialty) {
    alert('الرجاء اختيار التخصص');
    return false;
  }

  if (!validateEmail(email)) {
    alert('البريد الإلكتروني غير صالح');
    return false;
  }

  if (!validatePhone(phone)) {
    alert('رقم الهاتف يجب أن يكون 11 رقما ويبدأ بـ 01');
    return false;
  }

  if (password.length < 6) {
    alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    return false;
  }

  return true;
}

// التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// التحقق من صحة رقم الهاتف (مصر)
function validatePhone(phone) {
  const re = /^01[0125][0-9]{8}$/;
  return re.test(phone);
}

// معالجة أخطاء التسجيل
function handleSignupError(error) {
  let errorMessage = 'حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى';
  
  switch (error.code) {
    case 'auth/email-already-in-use':
      errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
      break;
    case 'auth/invalid-email':
      errorMessage = 'البريد الإلكتروني غير صالح';
      break;
    case 'auth/weak-password':
      errorMessage = 'كلمة المرور ضعيفة جداً';
      break;
    case 'auth/network-request-failed':
      errorMessage = 'مشكلة في الاتصال بالإنترنت';
      break;
  }
  
  alert(errorMessage);
  console.error('Signup error:', error);
}
