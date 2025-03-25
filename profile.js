// profile.js
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);
const db = getFirestore(app);

// متغير لتخزين بيانات المستخدم
let currentUserData = null;

// تحميل بيانات المستخدم
async function loadUserProfile() {
  const user = auth.currentUser;
  
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    // عرض حالة التحميل
    showLoadingState(true);
    
    // جلب بيانات المستخدم من Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      currentUserData = userDoc.data();
      updateProfileUI(currentUserData);
      
      // إذا كان المستخدم صنايعي، جلب بيانات إضافية
      if (currentUserData.userType === 'worker') {
        loadWorkerAdditionalData(user.uid);
      }
    } else {
      alert("لم يتم العثور على بيانات المستخدم.");
      window.location.href = "complete-profile.html";
    }
  } catch (error) {
    console.error("خطأ في جلب البيانات:", error);
    alert("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة لاحقاً.");
  } finally {
    showLoadingState(false);
  }
}

// تحديث واجهة المستخدم ببيانات المستخدم
function updateProfileUI(userData) {
  document.getElementById("userName").textContent = userData.fullName || "غير معروف";
  
  const userTypeElement = document.getElementById("userType");
  userTypeElement.innerHTML = `<i class="fas fa-tools"></i> ${userData.userType === "client" ? "عميل" : "صنايعي"}`;
  
  document.getElementById("location").innerHTML = 
    `<i class="fas fa-map-marker-alt"></i> ${userData.city || "غير محدد"} - ${userData.governorate || "غير محدد"}`;
  
  const phoneElement = document.getElementById("phone");
  phoneElement.textContent = userData.phone || "غير متوفر";
  phoneElement.href = userData.phone ? `tel:${userData.phone}` : "#";
  
  const emailElement = document.getElementById("email");
  emailElement.textContent = userData.email || "غير متوفر";
  emailElement.href = userData.email ? `mailto:${userData.email}` : "#";
  
  // تحديث التقييم إذا كان صنايعي
  if (userData.userType === 'worker') {
    const ratingElement = document.querySelector('.rating');
    const stars = '★'.repeat(Math.round(userData.rating || 0)) + 
                 '☆'.repeat(5 - Math.round(userData.rating || 0));
    ratingElement.innerHTML = `${stars} <span>(${userData.jobsCompleted || 0} أعمال مكتملة)</span>`;
  }
}

// جلب بيانات إضافية للصنايعي
async function loadWorkerAdditionalData(userId) {
  try {
    // يمكنك هنا جلب معرض الأعمال والتقييمات من Firestore
    // مثال:
    // const galleryDoc = await getDoc(doc(db, "gallery", userId));
    // const reviewsDoc = await getDoc(doc(db, "reviews", userId));
    
    // هذه بيانات وهمية للتوضيح
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
  } catch (error) {
    console.error("خطأ في جلب بيانات الصنايعي:", error);
  }
}

// تحديث معرض الأعمال
function updateGalleryUI(galleryData) {
  const galleryContainer = document.querySelector('.gallery .images');
  galleryContainer.innerHTML = '';
  
  galleryData.forEach(item => {
    galleryContainer.innerHTML += `
      <img src="${item.url}" alt="${item.title}" title="${item.title}">
    `;
  });
}

// تحديث قسم التقييمات
function updateReviewsUI(reviewsData) {
  const reviewsContainer = document.querySelector('.reviews');
  reviewsContainer.innerHTML = '<h3>التقييمات</h3>';
  
  reviewsData.forEach(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    reviewsContainer.innerHTML += `
      <div class="review">
        <div class="reviewer">${review.reviewer}</div>
        <div class="rating">${stars}</div>
        <div class="comment">${review.comment}</div>
      </div>
    `;
  });
}

// عرض/إخفاء حالة التحميل
function showLoadingState(isLoading) {
  const loadingElements = document.querySelectorAll('.loading-state');
  
  loadingElements.forEach(element => {
    element.style.display = isLoading ? 'block' : 'none';
  });
  
  if (!isLoading) {
    document.querySelectorAll('[id]').forEach(element => {
      if (element.textContent === 'جارٍ التحميل...') {
        element.textContent = 'غير متوفر';
      }
    });
  }
}

// تسجيل الخروج
async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("خطأ في تسجيل الخروج:", error);
    alert("حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.");
  }
}

// تعيين الوظائف للنطاق العام
window.logoutUser = logoutUser;

// متابعة حالة المصادقة
auth.onAuthStateChanged((user) => {
  if (user) {
    loadUserProfile();
  } else {
    window.location.href = "login.html";
  }
});
