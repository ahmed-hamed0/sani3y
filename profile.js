import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);
const db = getFirestore(app);

let currentUserData = null;

// عرض/إخفاء حالة التحميل
function showLoadingState(isLoading) {
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) loadingOverlay.style.display = isLoading ? 'flex' : 'none';

  document.querySelectorAll('button').forEach(btn => {
    btn.disabled = isLoading;
  });
}

// تحميل بيانات المستخدم
async function loadUserProfile() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  showLoadingState(true);

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      currentUserData = userDoc.data();
      updateProfileUI(currentUserData);

      if (currentUserData.userType === 'worker') {
        await loadWorkerAdditionalData(user.uid);
      }
    } else {
      alert("لم يتم العثور على بيانات المستخدم.");
      window.location.href = "complete-profile.html";
    }
  } catch (error) {
    console.error("خطأ في تحميل البيانات:", error);
    alert("حدث خطأ أثناء تحميل البيانات.");
  } finally {
    showLoadingState(false);
  }
}

// تحديث الواجهة بالبيانات
function updateProfileUI(data) {
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "غير متوفر";
  };

  setText("userName", data.fullName);
  setText("userType", data.userType === "client" ? "عميل" : "صنايعي");

  const locEl = document.getElementById("location");
  if (locEl) locEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.city || "غير محدد"} - ${data.governorate || "غير محدد"}`;

  const phoneEl = document.getElementById("phone");
  if (phoneEl) {
    phoneEl.textContent = data.phone || "غير متوفر";
    phoneEl.href = data.phone ? `tel:${data.phone}` : "#";
  }

  const emailEl = document.getElementById("email");
  if (emailEl) {
    emailEl.textContent = data.email || "غير متوفر";
    emailEl.href = data.email ? `mailto:${data.email}` : "#";
  }

  if (data.userType === 'worker') {
    const ratingEl = document.querySelector('.rating');
    if (ratingEl) {
      const stars = '★'.repeat(Math.round(data.rating || 0)) + '☆'.repeat(5 - Math.round(data.rating || 0));
      ratingEl.innerHTML = `${stars} <span>(${data.jobsCompleted || 0} أعمال مكتملة)</span>`;
    }
  }
}

// بيانات إضافية للصنايعي
async function loadWorkerAdditionalData(userId) {
  try {
    // وهمية – عدل حسب قاعدة بياناتك
    const galleryData = [
      { url: "assets/image/man1.jpg", title: "عمل 1" },
      { url: "assets/image/man2.jpg", title: "عمل 2" },
      { url: "assets/image/man1.jpg", title: "عمل 3" }
    ];

    const reviewsData = [
      { reviewer: "محمد أحمد", rating: 5, comment: "عمل ممتاز ومتقن" },
      { reviewer: "أحمد علي", rating: 4, comment: "جيد ولكن تأخر قليلاً" }
    ];

    updateGalleryUI(galleryData);
    updateReviewsUI(reviewsData);
  } catch (err) {
    console.error("خطأ في تحميل بيانات إضافية:", err);
  }
}

// تحديث معرض الأعمال
function updateGalleryUI(data) {
  const container = document.querySelector('.gallery .images');
  if (!container) return;
  container.innerHTML = '';
  data.forEach(item => {
    container.innerHTML += `<img src="${item.url}" alt="${item.title}" title="${item.title}">`;
  });
}

// تحديث التقييمات
function updateReviewsUI(data) {
  const container = document.querySelector('.reviews');
  if (!container) return;
  container.innerHTML = '<h3>التقييمات</h3>';
  data.forEach(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    container.innerHTML += `
      <div class="review">
        <div class="reviewer">${r.reviewer}</div>
        <div class="rating">${stars}</div>
        <div class="comment">${r.comment}</div>
      </div>`;
  });
}

// تسجيل الخروج
async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (err) {
    console.error("خطأ في تسجيل الخروج:", err);
    alert("حدث خطأ أثناء تسجيل الخروج.");
  }
}

window.logoutUser = logoutUser;

// متابعة حالة تسجيل الدخول
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserProfile();
  } else {
    const profileContent = document.querySelector('.profile-content');
    const authPrompt = document.querySelector('.auth-prompt');

    if (profileContent && authPrompt) {
      profileContent.style.display = 'none';
      authPrompt.style.display = 'block';
    } else {
      window.location.href = "login.html";
    }
  }
});
