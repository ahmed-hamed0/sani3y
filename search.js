import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from './firebase-config.js';

// بيانات الفلاتر (يجب أن تكون متطابقة مع بياناتك الفعلية)
const governorates = {
  "القاهرة": [
    "وسط البلد", "المعادي", "مدينة نصر", "مصر الجديدة", "العباسية", "حلوان", "شبرا", 
    "عين شمس", "التجمع الخامس", "الزمالك", "المرج", "السيدة زينب", "المطرية", "الوايلي", 
    "المنيل", "الخانكة", "العبور", "القاهرة الجديدة", "الشيخ زايد", "بدر", "15 مايو", 
    "المقطم", "النزهة", "الزيتون", "الزاوية الحمراء", "السلام", "طرة", "دار السلام", 
    "البساتين", "حدائق القبة", "الماظة", "مصر القديمة", "منشأة ناصر", "غرب القاهرة", 
    "شرق القاهرة"
  ],
  "الجيزة": [
    "6 أكتوبر", "بولاق الدكرور", "الدقي", "العجوزة", "الهرم", "البدرشين", "كرداسة", 
    "أطفيح", "الصف", "العياط", "الواحات البحرية", "منشأة القناطر", "أوسيم", "كفر حكيم", 
    "أبو النمرس", "الوراق", "المنيب", "إمبابة", "المناشي", "العمرانية", "الطالبية", 
    "أبو رواش", "كفر غطاطي"
  ],
  "الإسكندرية": [
    "العجمي", "سيدي جابر", "المنتزه", "العصافرة", "محرم بك", "سموحة", "العامرية", 
    "باكوس", "الورديان", "الأنفوشي", "كامب شيزار", "رأس التين", "المندرة", "السيوف", 
    "البيطاش", "الابراهيمية", "الظاهرية", "اللبان", "السرايا", "المنشية", "كليوباترا", 
    "المعمورة"
  ],
  "القليوبية": [
    "بنها", "قليوب", "شبرا الخيمة", "القناطر الخيرية", "طوخ", "كفر شكر", "الخانكة", 
    "العبور", "الخصوص", "شبين القناطر", "كفر طحلة", "قلما", "أبو زعبل", "الزهور", 
    "التلين", "المنصورة الجديدة"
  ],
  "الدقهلية": [
    "المنصورة", "طلخا", "ميت غمر", "بلقاس", "شربين", "دكرنس", "السنبلاوين", "منية النصر", 
    "الجمالية", "تمي الأمديد", "المطرية", "بني عبيد", "أجا", "ميت سلسيل", "المنزلة", 
    "ميت الخولى", "السنبلاوين الجديدة"
  ],
  "الشرقية": [
    "الزقازيق", "العاشر من رمضان", "أبو كبير", "فاقوس", "ههيا", "الإبراهيمية", "كفر صقر", 
    "أولاد صقر", "مشتول السوق", "بلبيس", "منيا القمح", "الصالحية الجديدة", "أبو حماد", 
    "القرين", "ديرب نجم", "كفر صقر الجديدة"
  ],
  "الغربية": [
    "طنطا", "المحلة الكبرى", "زفتى", "كفر الزيات", "السنطة", "سمنود", "بسيون", "قطور", 
    "شبرا ملس", "قطور الجديدة"
  ],
  "المنوفية": [
    "شبين الكوم", "منوف", "تلا", "الباجور", "أشمون", "بركة السبع", "قويسنا", "السادات", 
    "سرس الليان", "منوف الجديدة"
  ],
  "البحيرة": [
    "دمنهور", "كفر الدوار", "رشيد", "إدكو", "المحمودية", "إيتاي البارود", "أبو حمص", 
    "الدلنجات", "حوش عيسى", "وادي النطرون", "كوم حمادة", "شبراخيت", "النوبارية", "وادي النطرون الجديدة"
  ],
  "كفر الشيخ": [
    "كفر الشيخ", "دسوق", "فوه", "بيلا", "مطوبس", "الحامول", "سيدي سالم", "الرياض", 
    "بلطيم", "برج البرلس", "سيدي غازي", "الحامول الجديدة"
  ],
  "دمياط": [
    "دمياط", "فارسكور", "الزرقا", "كفر سعد", "رأس البر", "عزبة البرج", "ميت أبو غالب", 
    "كفر البطيخ", "السرو", "الروضة", "دمياط الجديدة"
  ],
  "بورسعيد": [
    "بورسعيد", "حي الضواحي", "حي الجنوب", "بور فؤاد", "حي الشرق", "حي الغرب", "حي المناخ", 
    "بورسعيد الجديدة"
  ],
  "الإسماعيلية": [
    "الإسماعيلية", "فايد", "القنطرة شرق", "التل الكبير", "أبو صوير", "القصاصين", 
    "التل الكبير الجديدة"
  ],
  "السويس": [
    "السويس", "حي الأربعين", "حي الجناين", "عتاقة", "السويس الجديدة"
  ],
  "الفيوم": [
    "الفيوم", "طامية", "سنورس", "إطسا", "يوسف الصديق", "أبشواي", "طامية الجديدة"
  ],
  "بني سويف": [
    "بني سويف", "الواسطي", "ناصر", "إهناسيا", "ببا", "سمسطا", "الفشن", "بني سويف الجديدة"
  ],
  "المنيا": [
    "المنيا", "ملوي", "دير مواس", "مغاغة", "بني مزار", "مطاي", "سمالوط", "أبو قرقاص", 
    "المنيا الجديدة"
  ],
  "أسيوط": [
    "أسيوط", "ديروط", "أبنوب", "صدفا", "القوصية", "منفلوط", "الغنايم", "أبو تيج", 
    "ساحل سليم", "أسيوط الجديدة"
  ],
  "سوهاج": [
    "سوهاج", "جرجا", "طهطا", "البلينا", "أخميم", "المراغة", "جهينة", "ساقلته", 
    "دار السلام", "سوهاج الجديدة"
  ],
  "قنا": [
    "قنا", "قوص", "نقادة", "دشنا", "أبو تشت", "نجع حمادي", "الوقف", "فرشوط", "قفط", 
    "قنا الجديدة"
  ],
  "الأقصر": [
    "الأقصر", "إسنا", "الزينية", "البياضية", "القرنة", "أرمنت", "الطود", "الأقصر الجديدة"
  ],
  "أسوان": [
    "أسوان", "كوم أمبو", "دراو", "نصر النوبة", "إدفو", "كلابشة", "أسوان الجديدة"
  ],
  "البحر الأحمر": [
    "الغردقة", "مرسى علم", "رأس غارب", "سفاجا", "القصير", "حلايب", "شلاتين", "الغردقة الجديدة"
  ],
  "الوادي الجديد": [
    "الخارجة", "الداخلة", "الفرافرة", "باريس", "بلاط", "الوادي الجديد"
  ],
  "مطروح": [
    "مرسى مطروح", "الحمام", "العلمين", "سيوة", "الضبعة", "النجيلة", "سيدي براني", 
    "السلوم", "مطروح الجديدة"
  ],
  "شمال سيناء": [
    "العريش", "الشيخ زويد", "رفح", "بئر العبد", "الحسنة", "نخل", "شمال سيناء الجديدة"
  ],
  "جنوب سيناء": [
    "شرم الشيخ", "دهب", "نويبع", "طابا", "الطور", "سانت كاترين", "أبو رديس", "أبو زنيمة", 
    "رأس سدر", "جنوب سيناء الجديدة"
  ]
};


const specialties = [
  "نقاش", 
  "مبلط", 
  "نجار", 
  "سباك صحي", 
  "كهربائي منازل", 
  "حداد مسلح", 
  "مبيض محارة", 
  "ميكانيكي سيارات", 
  "فني تركيب زجاج", 
  "فني تركيب ستائر", 
  "فني كهرباء محطات", 
  "فني تبريد وتكييف", 
  "نقاش جبسيوم بورد", 
  "مبلط سيراميك", 
  "فني تركيب أنظمة صوت", 
  "فني تركيب أطباق الدش", 
  "فني تركيب كاميرات مراقبة", 
  "فني صيانة الحواسيب", 
  "فني صيانة أجهزة كهربائية", 
  "فني تركيب أنظمة حماية", 
  "فني صيانة أنظمة أمان", 
  "عامل تركيب جبس بورد", 
  "عامل تركيب ورق الحائط", 
  "فني تركيب أرضيات باركيه", 
  "مبلط سيراميك وبورسلين", 
  "فني ميكانيكا آلات صناعية", 
  "فني تشغيل وصيانة ماكينات", 
  "فني تركيب أنظمة تحكم ذكية", 
  "فني صيانة معدات صناعية", 
  "فني تركيب أنظمة طاقة شمسية", 
  "فني إصلاح غسالات وثلاجات", 
  "فني تركيب مصاعد كهربائية", 
  "مقاول أعمال بناء وتشطيب", 
  "فني شبكات الإنترنت والاتصالات", 
  "فني صيانة المكيفات المركزية"
];


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
      <img src="${worker.profileImage || 'assets/image/craftsman.jpg'}" alt="${worker.fullName}" class="worker-image">
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
