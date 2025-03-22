document.addEventListener("DOMContentLoaded", function() {
  const userTypeSelect = document.getElementById("userType");
  const specialtyGroup = document.getElementById("specialtyGroup");
  const specialtySelect = document.getElementById("specialty");

  userTypeSelect.addEventListener("change", function() {
    if (this.value === "worker") {
      specialtyGroup.style.display = "block";
      specialtySelect.setAttribute("required", "true"); // جعل التخصص مطلوب فقط عند اختيار صنايعي
    } else {
      specialtyGroup.style.display = "none";
      specialtySelect.removeAttribute("required"); // إزالة required عند اختيار عميل
    }
  });

  document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const userType = document.getElementById("userType").value;
    const specialty = userType === "worker" ? specialtySelect.value : "";
    const governorate = document.getElementById("governorate").value;
    const city = document.getElementById("city").value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return db.collection("users").doc(userCredential.user.uid).set({
          fullName,
          email,
          phone,
          userType,
          specialty,
          governorate,
          city
        });
      })
      .then(() => {
        alert("تم إنشاء الحساب بنجاح!");
        window.location.href = "login.html";
      })
      .catch((error) => {
        alert("خطأ أثناء التسجيل: " + error.message);
      });
  });
});
