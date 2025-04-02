import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from './firebase-config.js';

const db = getFirestore(app);

// بيانات الفلاتر
const governorates = {
  "القاهرة": ["مدينة نصر", "المعادي", "التجمع الخامس"],
  "الجيزة": ["الهرم", "الدقي", "المهندسين"],
  "الإسكندرية": ["سموحة", "العجمي", "محرم بك"],
  "الدقهلية": ["المنصورة", "طلخا", "ميت غمر"],
  "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس"]
};
const specialties = ["سباك صحي", "كهربائي منازل", "نجار", "مبلط", "نقاش"];

// تعبئة الفلاتر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  setupSearchForm();
});

function initFilters() {
  try {
    const govSelect = document.getElementById('governorate');
    const citySelect = document.getElementById('city');
    const specialtySelect = document.getElementById('specialty');

    if (!govSelect || !citySelect || !specialtySelect) {
      console.error("عناصر الفلترة غير موجودة في الـ HTML");
      return;
    }

    // تعبئة المحافظات
    Object.keys(governorates).forEach(gov => {
      const option = document.createElement('option');
      option.value = gov;
      option.textContent = gov;
      govSelect.appendChild(option);
    });

    // عند اختيار محافظة، تحديث قائمة المدن
    govSelect.addEventListener('change', () => {
      citySelect.innerHTML = '<option value="">اختر المدينة</option>';
      citySelect.disabled = !govSelect.value;
      
      const selectedGov = govSelect.value;
      if (selectedGov && governorates[selectedGov]) {
        governorates[selectedGov].forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });
        citySelect.disabled = false;
      }
    });

    // تعبئة التخصصات
    specialties.forEach(spec => {
      const option = document.createElement('option');
      option.value = spec;
      option.textContent = spec;
      specialtySelect.appendChild(option);
    });
  } catch (error) {
    console.error("خطأ أثناء تحميل الفلاتر:", error);
  }
}

function setupSearchForm() {
  const searchForm = document.getElementById('filterForm');
  if (!searchForm) {
    console.error("نموذج البحث غير موجود");
    return;
  }

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loadingIndicator = document.getElementById('loadingIndicator');
    const searchButton = searchForm.querySelector('.filter-button');
    const resultsContainer = document.getElementById('workersResults');
    
    // عرض مؤشر التحميل
    loadingIndicator.style.display = 'flex';
    searchButton.disabled = true;
    
    const governorate = document.getElementById('governorate').value;
    const city = document.getElementById('city').value;
    const specialty = document.getElementById('specialty').value;
    
    try {
      // مسح النتائج السابقة
      resultsContainer.innerHTML = '';
      
      // التحقق من إدخال جميع الحقول
      if (!governorate || !city || !specialty) {
        showError("الرجاء اختيار جميع خيارات الفلترة");
        return;
      }
      
      // إنشاء استعلام البحث
      const q = query(
        collection(db, "users"),
        where("userType", "==", "worker"),
        where("governorate", "==", governorate),
        where("city", "==", city),
        where("specialty", "==", specialty)
      );
      
      // تنفيذ الاستعلام
      const querySnapshot = await getDocs(q);
      
      // عرض النتائج
      displayResults(querySnapshot);
    } catch (error) {
      console.error("خطأ في البحث:", error);
      showError("حدث خطأ أثناء البحث. يرجى المحاولة لاحقاً");
    } finally {
      // إخفاء مؤشر التحميل
      loadingIndicator.style.display = 'none';
      searchButton.disabled = false;
    }
  });
}

function displayResults(querySnapshot) {
  const resultsContainer = document.getElementById('workersResults');
  
  if (!resultsContainer) {
    console.error("حاوية النتائج غير موجودة");
    return;
  }

  // مسح المحتوى القديم
  resultsContainer.innerHTML = '';

  if (querySnapshot.empty) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-frown"></i>
        <p>لا توجد نتائج مطابقة لبحثك</p>
      </div>
    `;
    return;
  }
  
  // عرض كل نتيجة
  querySnapshot.forEach(doc => {
    const worker = doc.data();
    const workerCard = document.createElement('div');
    workerCard.className = 'worker-card';
    workerCard.innerHTML = `
      <img src="${worker.profileImage || 'assets/image/man.jpg'}" alt="${worker.fullName}" class="worker-image">
      <div class="worker-info">
        <h3 class="worker-name">${worker.fullName || "غير معروف"}</h3>
        <p class="worker-specialty">
          <i class="fas fa-tools"></i> ${worker.specialty || "غير محدد"}
        </p>
        <p class="worker-location">
          <i class="fas fa-map-marker-alt"></i> ${worker.city || "غير محدد"} - ${worker.governorate || "غير محدد"}
        </p>
        <div class="worker-rating">
          ${'★'.repeat(worker.rating || 0)}${'☆'.repeat(5 - (worker.rating || 0))}
          <span>(${worker.jobsCompleted || 0} أعمال)</span>
        </div>
        <a href="worker-profile.html?id=${doc.id}" class="view-profile">
          عرض الملف الشخصي
        </a>
      </div>
    `;
    resultsContainer.appendChild(workerCard);
  });
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  
  const form = document.getElementById('filterForm');
  form.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}
