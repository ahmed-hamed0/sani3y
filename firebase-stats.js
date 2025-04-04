// تأكد من أنك قمت بإعداد Firebase في مشروعك مسبقاً
// هذه الدالة ستعمل بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // استبدل بتفاصيل مشروع Firebase الخاص بك
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // تهيئة Firebase إذا لم تكن مهيئة بالفعل
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // الحصول على مرجع لقاعدة البيانات
    const db = firebase.firestore();

    // دالة لجلب عدد المستندات في مجموعة معينة
    async function getCollectionCount(collectionName) {
        try {
            const snapshot = await db.collection(collectionName).get();
            return snapshot.size;
        } catch (error) {
            console.error("Error getting documents count: ", error);
            return 0;
        }
    }

    // دالة لتحديث الأعداد في الواجهة
    async function updateCounts() {
        // افترض أن لديك مجموعتين في Firebase تسمى 'craftsmen' و 'clients'
        const craftsmenCount = await getCollectionCount('craftsmen');
        const clientsCount = await getCollectionCount('clients');

        // تحديث الأرقام في الواجهة
        document.getElementById('craftsmenCount').textContent = craftsmenCount;
        document.getElementById('clientsCount').textContent = clientsCount;
    }

    // استدعاء الدالة لتحديث الأعداد عند تحميل الصفحة
    updateCounts();

    // (اختياري) تحديث الأعداد كل فترة زمنية معينة (مثلاً كل دقيقة)
    setInterval(updateCounts, 60000);
});
