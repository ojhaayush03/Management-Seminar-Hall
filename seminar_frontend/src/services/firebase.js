import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDydXT9kXsCDoMDhdn3aAWYpAAOFuD6YO4",
    authDomain: "seminar-13cb6.firebaseapp.com",
    projectId: "seminar-13cb6",
    storageBucket: "seminar-13cb6.firebasestorage.app",
    messagingSenderId: "379491024462",
    appId: "1:379491024462:web:758fc656e3f540199c8d1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Error setting auth persistence:", error);
    });

export { app, auth };