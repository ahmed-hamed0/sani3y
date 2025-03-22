auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("users").doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          document.getElementById("userName").innerText = doc.data().fullName;
          document.getElementById("userEmail").innerText = doc.data().email;
          document.getElementById("userPhone").innerText = doc.data().phone;
          document.getElementById("userRole").innerText = doc.data().userType === "client" ? "عميل" : "صنايعي";
        }
      });
  } else {
    window.location.href = "login.html";
  }
});

// تسجيل الخروج
function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
window.logoutUser = logoutUser;
