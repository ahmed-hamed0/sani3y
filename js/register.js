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

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return db.collection("users").doc(userCredential.user.uid).set({
        fullName,
        email,
        phone,
        userType,
        specialty: userType === 'worker' ? specialty : ''
      });
    })
    .then(() => {
      alert('تم إنشاء الحساب بنجاح!');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      alert('حدث خطأ أثناء إنشاء الحساب: ' + error.message);
    });
});
