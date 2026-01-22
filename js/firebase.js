import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVNXfmezAwYXPFzu7b_mBlUWCDNnVek_s",
    authDomain: "kitchen-prep.firebaseapp.com",
    projectId: "kitchen-prep",
    storageBucket: "kitchen-prep.firebasestorage.app",
    messagingSenderId: "986168499689",
    appId: "1:986168499689:web:8133e23a6012c957e87f78"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
