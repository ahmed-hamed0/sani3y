document.addEventListener('DOMContentLoaded', () => {
  const userTypeSelect = document.getElementById('userType');
  const specialtyGroup = document.getElementById('specialtyGroup');

  if (userTypeSelect && specialtyGroup) {
    userTypeSelect.addEventListener('change', (e) => {
      if (e.target.value === 'craftsman') {
        specialtyGroup.style.display = 'block';
      } else {
        specialtyGroup.style.display = 'none';
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          alert('تم تسجيل الدخول بنجاح!');
          window.location.href = 'dashboard.html'; // توجيه المستخدم
        })
        .catch((error) => {
          alert('خطأ في تسجيل الدخول: ' + error.message);
        });
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          alert('تم إنشاء الحساب بنجاح!');
          window.location.href = 'index.html'; // توجيه المستخدم لتسجيل الدخول
        })
        .catch((error) => {
          alert('خطأ في التسجيل: ' + error.message);
        });
    });
  }
});
