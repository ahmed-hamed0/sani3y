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

    // دالة لجلب عدد المستخدمين حسب النوع
    async function getUserCount(userType) {
        try {
            const snapshot = await db.collection('users')
                .where('userType', '==', userType)
                .get();
                
            console.log(`Number of ${userType}:`, snapshot.size);
            return snapshot.size;
        } catch (error) {
            console.error(`Error getting ${userType} count:`, error);
            return 0;
        }
    }

    // دالة لتحديث الأعداد في الواجهة
    async function updateCounts() {
        try {
            const craftsmenCount = await getUserCount('worker');
            const clientsCount = await getUserCount('client');
            
            document.getElementById('craftsmenCount').textContent = craftsmenCount;
            document.getElementById('clientsCount').textContent = clientsCount;
        } catch (error) {
            console.error('Error updating counts:', error);
        }
    }

    updateCounts();
    setInterval(updateCounts, 60000);
});
