// تأكد من أن Firebase تم تحميله قبل استخدامه
if (typeof firebase === "undefined") {
  console.error("Firebase لم يتم تحميله. تأكد من تحميل Firebase SDK قبل firebase.js");
} else {
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
  firebase.initializeApp(firebaseConfig);
  window.auth = firebase.auth();
  window.db = firebase.firestore();
}
