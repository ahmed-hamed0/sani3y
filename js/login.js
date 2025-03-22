document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert('تم تسجيل الدخول بنجاح!');
      window.location.href = 'profile.html';
    })
    .catch((error) => {
      alert('خطأ: ' + error.message);
    });
});
