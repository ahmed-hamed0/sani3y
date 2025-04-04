document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
        authDomain: "sani3ydotcom.firebaseapp.com",
        projectId: "sani3ydotcom",
        storageBucket: "sani3ydotcom.appspot.com",
        messagingSenderId: "880517005136",
        appId: "1:880517005136:web:e7f08efdadee45ec943655"
    };

    // تهيئة Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();

    // دالة محسنة لجلب العدد مع وجود تسجيل للأخطاء
    async function getCollectionCount(collectionName) {
        try {
            const snapshot = await db.collection(collectionName).count().get();
            console.log(`Number of ${collectionName}:`, snapshot.data().count);
            return snapshot.data().count;
        } catch (error) {
            console.error(`Error getting ${collectionName} count:`, error);
            return 0;
        }
    }

    async function updateCounts() {
        console.log("Updating counts...");
        try {
            const [craftsmenCount, clientsCount] = await Promise.all([
                getCollectionCount('craftsmen'),
                getCollectionCount('clients')
            ]);
            
            console.log("Counts:", {craftsmenCount, clientsCount});
            
            document.getElementById('craftsmenCount').textContent = craftsmenCount;
            document.getElementById('clientsCount').textContent = clientsCount;
        } catch (error) {
            console.error("Error updating counts:", error);
        }
    }

    // تحديث الأعداد مع إعادة المحاولة عند الفشل
    function initializeWithRetry(retries = 3, delay = 1000) {
        updateCounts().catch(error => {
            if (retries > 0) {
                console.log(`Retrying... ${retries} attempts left`);
                setTimeout(() => initializeWithRetry(retries - 1, delay * 2), delay);
            } else {
                console.error("Failed after multiple attempts:", error);
            }
        });
    }

    initializeWithRetry();
    setInterval(updateCounts, 60000);
});
