import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
      alert('تم إنشاء الحساب بنجاح!');
      window.location.href = 'login.html'; // Redirect to login page
    })
    .catch((error) => {
      alert('حدث خطأ: ' + error.message);
    });
});
