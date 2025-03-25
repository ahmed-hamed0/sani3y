// profile.js
import { auth, db } from './firebase.js';

auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("users").doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          document.getElementById("userName").innerText = userData.fullName || "غير معروف";
          document.getElementById("userType").innerHTML = `<i class="fas fa-tools"></i> ${userData.userType === "client" ? "عميل" : "صنايعي"}`;
          document.getElementById("location").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${userData.city || "غير محدد"} - ${userData.governorate || "غير محدد"}`;
          document.getElementById("phone").innerText = userData.phone || "غير متوفر";
          document.getElementById("phone").href = `tel:${userData.phone}`;
          document.getElementById("email").innerText = userData.email || "غير متوفر";
          document.getElementById("email").href = `mailto:${userData.email}`;
        } else {
          alert("لم يتم العثور على بيانات المستخدم.");
          window.location.href = "login.html";
        }
      }).catch((error) => {
        console.error("خطأ أثناء جلب البيانات:", error);
        alert("حدث خطأ أثناء تحميل البيانات.");
      });
  } else {
    window.location.href = "login.html";
  }
});

// تسجيل الخروج
function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    alert("خطأ أثناء تسجيل الخروج: " + error.message);
  });
}
window.logoutUser = logoutUser;
