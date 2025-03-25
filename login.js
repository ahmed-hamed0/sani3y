// login.js
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('errorMessage');
  
  // إدارة حالة التحميل
  loginBtn.disabled = true;
  loginBtn.textContent = 'جاري المعالجة...';
  loading.style.display = 'block';
  errorMessage.style.display = 'none';
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // التحقق من حالة البريد الإلكتروني
    if (!user.emailVerified) {
      // يمكنك إضافة إعادة إرسال بريد التحقق هنا إذا أردت
      alert('الرجاء التحقق من بريدك الإلكتروني قبل تسجيل الدخول');
      return;
    }
    
    // توجيه المستخدم حسب نوعه (يمكنك تعديل هذا الجزء حسب احتياجاتك)
    window.location.href = user.displayName ? 'profile.html' : 'profile.html';
    
  } catch (error) {
    // معالجة الأخطاء
    let message = 'حدث خطأ أثناء تسجيل الدخول';
    
    switch(error.code) {
      case 'auth/invalid-email':
        message = 'بريد إلكتروني غير صالح';
        break;
      case 'auth/user-disabled':
        message = 'هذا الحساب معطل';
        break;
      case 'auth/user-not-found':
        message = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
        break;
      case 'auth/wrong-password':
        message = 'كلمة المرور غير صحيحة';
        break;
      case 'auth/too-many-requests':
        message = 'عدد محاولات تسجيل الدخول أكثر من المسموح، يرجى المحاولة لاحقاً';
        break;
      case 'auth/network-request-failed':
        message = 'مشكلة في الاتصال بالإنترنت';
        break;
    }
    
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    console.error('Login error:', error);
    
  } finally {
    // استعادة حالة الزر الأصلية
    loginBtn.disabled = false;
    loginBtn.textContent = 'تسجيل الدخول';
    loading.style.display = 'none';
  }
});
