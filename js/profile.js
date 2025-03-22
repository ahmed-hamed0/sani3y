import { auth, db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

async function loadUserProfile() {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            document.getElementById("userName").innerText = userData.name;
            document.getElementById("userEmail").innerText = userData.email;
            document.getElementById("userPhone").innerText = userData.phone;
            document.getElementById("userRole").innerText = userData.role === "client" ? "عميل" : "صنايعي";
        }
    }
}

// تسجيل الخروج
window.logoutUser = async function () {
    await signOut(auth);
    window.location.href = "login.html";
};

window.onload = loadUserProfile;
