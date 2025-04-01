// search.js
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from './firebase-config.js';

const db = getFirestore(app);

// بيانات الفلاتر
const governorates = ["القاهرة", "الجيزة", "الإسكندرية"]; // أضف باقي المحافظات
const specialties = ["سباك صحي", "كهربائي منازل", "نجار"]; // أضف جميع التخصصات

// تعبئة الفلاتر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
});

function initFilters() {
  const govSelect = document.getElementById('governorate');
  const specialtySelect = document.getElementById('specialty');
  
  // تعبئة المحافظات
  governorates.forEach(gov => {
    const option = document.createElement('option');
    option.value = gov;
    option.textContent = gov;
    govSelect.appendChild(option);
  });
  
  // تعبئة التخصصات
  specialties.forEach(spec => {
    const option = document.createElement('option');
    option.value = spec;
    option.textContent = spec;
    specialtySelect.appendChild(option);
  });
  
  // تحديث المدن عند اختيار المحافظة
  govSelect.addEventListener('change', updateCities);
}

// معالجة البحث
document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const governorate = document.getElementById('governorate').value;
  const city = document.getElementById('city').value;
  const specialty = document.getElementById('specialty').value;
  
  try {
    const q = query(
      collection(db, "users"),
      where("userType", "==", "worker"),
      where("governorate", "==", governorate),
      where("city", "==", city),
      where("specialty", "==", specialty)
    );
    
    const querySnapshot = await getDocs(q);
    displayResults(querySnapshot);
  } catch (error) {
    console.error("Search error:", error);
    showError("حدث خطأ أثناء البحث. يرجى المحاولة لاحقاً");
  }
});

// عرض النتائج
function displayResults(querySnapshot) {
  const resultsContainer = document.getElementById('searchResults');
  
  if (querySnapshot.empty) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-frown"></i>
        <p>لا توجد نتائج مطابقة لبحثك</p>
      </div>
    `;
    return;
  }
  
  resultsContainer.innerHTML = '';
  
  querySnapshot.forEach(doc => {
    const worker = doc.data();
    const workerCard = `
      <div class="worker-card">
        <img src="${worker.profileImage || 'assets/default-avatar.jpg'}" alt="${worker.fullName}">
        <div class="worker-info">
          <h3>${worker.fullName}</h3>
          <p><i class="fas fa-tools"></i> ${worker.specialty}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${worker.city}, ${worker.governorate}</p>
          <a href="worker-profile.html?id=${doc.id}" class="view-profile">عرض الملف</a>
        </div>
      </div>
    `;
    resultsContainer.innerHTML += workerCard;
  });
}
