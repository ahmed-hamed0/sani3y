// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  sendEmailVerification 
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
  storageBucket: "sani3ydotcom.appspot.com",
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

// دالة التحقق من صحة رقم الهاتف المصري
function validateEgyptPhoneNumber(phone) {
  // يجب أن يبدأ بـ 1 أو 2 أو 5 وأن يكون طوله 9 أرقام (بدون +20)
  const regex = /^(1|2|5)\d{8}$/;
  return regex.test(phone);
}

// معالجة إرسال النموذج
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // إدارة حالة الزر أثناء التحميل
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'جاري إنشاء الحساب...';
  submitBtn.disabled = true;

  // جمع بيانات النموذج
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phoneInput = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const userType = userTypeSelect.value;
  const specialty = userType === 'worker' ? document.getElementById('specialty').value : '';
  const governorate = document.getElementById('governorate').value;
  const city = document.getElementById('city').value;

  // تنظيف رقم الهاتف من أي أحرف غير رقمية
  const cleanedPhone = phoneInput.replace(/\D/g, '');

  // التحقق من صحة الرقم المصري
  if (!validateEgyptPhoneNumber(cleanedPhone)) {
    alert('رقم الهاتف غير صحيح. يجب أن يبدأ بـ 1 أو 2 أو 5 ويتكون من 10 أرقام (بعد إضافة +20)');
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    return;
  }

  // دمج رمز الدولة مع رقم الهاتف
  const fullPhoneNumber = '+20' + cleanedPhone;

  // التحقق من صحة البيانات
  if (!validateForm(fullName, email, fullPhoneNumber, password, governorate, city, userType, specialty)) {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    return;
  }

  try {
    // إنشاء المستخدم في Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // إرسال بريد التحقق
    await sendEmailVerification(user);

    // حفظ بيانات المستخدم الإضافية في Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      phone: fullPhoneNumber, // هنا نستخدم الرقم الكامل مع رمز الدولة
      userType,
      specialty,
      governorate,
      city,
      createdAt: new Date(),
      profileCompleted: false,
      rating: userType === 'worker' ? 0 : null,
      jobsCompleted: userType === 'worker' ? 0 : null,
      emailVerified: false
    });

    // توجيه المستخدم بناءً على نوعه
    if (userType === 'worker') {
      alert('تم تسجيل حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني ثم إكمال ملفك الشخصي.');
      window.location.href = 'login.html';
    } else {
      alert('تم تسجيل حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني.');
      window.location.href = 'login.html';
    }

  } catch (error) {
    handleSignupError(error);
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
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
    default:
      console.error('Signup error:', error);
  }
  
  alert(errorMessage);
}
