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

    // تحقق من صحة البيانات
    if (!fullName || !email || !phone || !password || !userType || !governorate || !city) {
      alert('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    if (userType === 'worker' && !specialty) {
      alert('يرجى اختيار التخصص.');
      return;
    }

    // تسجيل المستخدم باستخدام Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
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
        alert('تم تسجيل الحساب بنجاح!');
        window.location.href = 'profile.html'; // توجيه المستخدم إلى صفحة الملف الشخصي
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`حدث خطأ: ${error.message}`);
      });
  });

  // إظهار/إخفاء حقل التخصص بناءً على نوع المستخدم
  document.getElementById('userType').addEventListener('change', function() {
    const specialtyGroup = document.getElementById('specialtyGroup');
    if (this.value === 'worker') {
      specialtyGroup.style.display = 'block';
    } else {
      specialtyGroup.style.display = 'none';
    }
  });
});
