document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    const specialty = document.getElementById('specialty').value;
    const governorate = document.getElementById('governorate').value;
    const city = document.getElementById('city').value;

    // تسجيل المستخدم باستخدام Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // تم تسجيل المستخدم بنجاح
        const user = userCredential.user;

        // حفظ البيانات الإضافية في Firestore
        return db.collection('users').doc(user.uid).set({
          fullName: fullName,
          email: email,
          phone: phone,
          userType: userType,
          specialty: userType === 'worker' ? specialty : null,
          governorate: governorate,
          city: city,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        // إعادة توجيه المستخدم إلى صفحة الملف الشخصي أو الصفحة الرئيسية
        alert('تم تسجيل الحساب بنجاح!');
        window.location.href = 'profile.html';
      })
      .catch((error) => {
        // معالجة الأخطاء
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`حدث خطأ: ${errorMessage}`);
      });
  });
});
