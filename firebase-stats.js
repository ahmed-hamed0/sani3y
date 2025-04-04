// استبدل الكود الحالي بهذا الكود المعدل
document.addEventListener('DOMContentLoaded', function() {
    // تكوين Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
        authDomain: "sani3ydotcom.firebaseapp.com",
        projectId: "sani3ydotcom",
        storageBucket: "sani3ydotcom.appspot.com",
        messagingSenderId: "880517005136",
        appId: "1:880517005136:web:e7f08efdadee45ec943655"
    };

    // تهيئة Firebase
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully");
        }
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }

    const db = firebase.firestore();

    // دالة محسنة لجلب عدد المستندات
    async function getCollectionCount(collectionName) {
        try {
            console.log(`Attempting to get count for ${collectionName}`);
            
            // الطريقة الأولى: استخدام count() (إن كان متاحاً في إصدارك)
            try {
                const countQuery = await db.collection(collectionName).count().get();
                const count = countQuery.data().count;
                console.log(`Count for ${collectionName}:`, count);
                return count;
            } catch (countError) {
                console.log(`Count query not supported, falling back to full query for ${collectionName}`);
            }
            
            // الطريقة الثانية: جلب كل المستندات إذا لم تعمل count()
            const snapshot = await db.collection(collectionName).get();
            console.log(`Number of ${collectionName} documents:`, snapshot.size);
            return snapshot.size;
        } catch (error) {
            console.error(`Error getting ${collectionName} count:`, error);
            return 0;
        }
    }

    // دالة لتحديث الأعداد مع إضافة إعادة المحاولة
    async function updateCounts() {
        console.log("Starting to update counts...");
        
        try {
            const [craftsmenCount, clientsCount] = await Promise.all([
                getCollectionCount('craftsmen'),
                getCollectionCount('clients')
            ]);
            
            console.log("Final counts - Craftsmen:", craftsmenCount, "Clients:", clientsCount);
            
            document.getElementById('craftsmenCount').textContent = craftsmenCount;
            document.getElementById('clientsCount').textContent = clientsCount;
        } catch (error) {
            console.error("Failed to update counts:", error);
            
            // إعادة المحاولة بعد 5 ثواني في حالة الفشل
            setTimeout(updateCounts, 5000);
        }
    }

    // بدء التحديث مع إعادة المحاولة
    updateCounts();
    
    // تحديث الأعداد كل دقيقة
    setInterval(updateCounts, 60000);
});
