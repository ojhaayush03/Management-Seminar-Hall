import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import "./login.css";
import { initializeApp } from "firebase/app";
import logo from "../assets/logo.png"

// Your Firebase config
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Your Admin Email
const ADMIN_EMAIL = "ayushojha9998@gmail.com";  // Change this to your email

const Login = () => {
    const navigate = useNavigate();
     // Remove automatic navigation inside useEffect
     useEffect(() => {
        auth.signOut(); // Ensure the user is signed out when they reach the login page
    }, []);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.email === ADMIN_EMAIL) {
                    navigate("/admin");  // Admin portal
                } else {
                    navigate("/user");   // User portal
                }
            }
        });
    }, [navigate]);

    const handleGoogleSignIn = async (event) => {
        event.preventDefault();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User signed in: ", user);

            // Redirect based on role
            if (user.email === ADMIN_EMAIL) {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } catch (error) {
            console.error("Error during sign-in: ", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <img src={logo} alt="Logo" className="logo" />  {/* Add logo here */}
                <h2>Login</h2>
                <button onClick={handleGoogleSignIn} className="google-signin-btn">Sign in with Google</button>
            </div>
        </div>
    );
};

export default Login;
