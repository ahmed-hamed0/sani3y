// هذه الدالة ستعمل بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // استبدل بتفاصيل مشروع Firebase الخاص بك
    const firebaseConfig = {
        apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
        authDomain: "sani3ydotcom.firebaseapp.com",
        projectId: "sani3ydotcom",
        storageBucket: "sani3ydotcom.appspot.com",
        messagingSenderId: "880517005136",
        appId: "1:880517005136:web:e7f08efdadee45ec943655"
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
