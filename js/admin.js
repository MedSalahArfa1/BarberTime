import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSUTtON3EZKPfdZR0qRaygngWEes-K9fs",
  authDomain: "barbertime-49a58.firebaseapp.com",
  projectId: "barbertime-49a58",
  storageBucket: "barbertime-49a58.appspot.com",
  messagingSenderId: "64092814528",
  appId: "1:64092814528:web:a8bd44924e54e6cef68125"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard.html";
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = "dashboard.html";
        }
    });
});
