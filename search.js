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
      const selectedGov = govSelect.value;
      if (selectedGov && governorates[selectedGov]) {
        governorates[selectedGov].forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });
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
