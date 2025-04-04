document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyDxd_9W5-Qc8rqSfGrKogla3xmHBX8liIg",
        authDomain: "sani3ydotcom.firebaseapp.com",
        projectId: "sani3ydotcom",
        storageBucket: "sani3ydotcom.appspot.com",
        messagingSenderId: "880517005136",
        appId: "1:880517005136:web:e7f08efdadee45ec943655"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();

    async function getCollectionCount(collectionName) {
        try {
            // استخدم count() للحصول على العدد مباشرة دون جلب كل المستندات
            const snapshot = await db.collection(collectionName).count().get();
            return snapshot.data().count;
        } catch (error) {
            console.error(`Error getting ${collectionName} count:`, error);
            
            // محاولة بديلة إذا لم يعمل count()
            try {
                const snapshot = await db.collection(collectionName).get();
                return snapshot.size;
            } catch (fallbackError) {
                console.error(`Fallback error for ${collectionName}:`, fallbackError);
                return 0;
            }
        }
    }

    async function updateCounts() {
        try {
            const craftsmenCount = await getCollectionCount('craftsmen');
            const clientsCount = await getCollectionCount('clients');
            
            console.log('Craftsmen count:', craftsmenCount);
            console.log('Clients count:', clientsCount);
            
            document.getElementById('craftsmenCount').textContent = craftsmenCount;
            document.getElementById('clientsCount').textContent = clientsCount;
        } catch (error) {
            console.error('Error updating counts:', error);
        }
    }

    updateCounts();
    setInterval(updateCounts, 60000);
});
