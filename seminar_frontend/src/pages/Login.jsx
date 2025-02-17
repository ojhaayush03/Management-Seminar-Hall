import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import "./login.css";
import { app, auth } from "../services/firebase";
import logo from "../assets/logo3.png"
import bgImage from "../assets/bg2.png";

// Initialize Firebase
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const Login = () => {
    const navigate = useNavigate();

    // Check if user is admin
    const checkAdminStatus = async (email) => {
        try {
            const adminRef = collection(db, "admins");
            const q = query(adminRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error checking admin status:", error);
            return false;
        }
    };

    // Only sign out if there's no stored userId
    useEffect(() => {
        if (!localStorage.getItem('userId')) {
            auth.signOut();
        }
    }, []);

    // Handle auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("Auth state changed - User:", user); // Debug log
            
            if (user) {
                const isAdmin = await checkAdminStatus(user.email);
                console.log("Is admin:", isAdmin); // Debug log
                if (isAdmin) {
                    navigate("/admin");
                } else if (localStorage.getItem('userId')) {
                    navigate("/user");
                }
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleGoogleSignIn = async (event) => {
        event.preventDefault();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Google sign-in successful:", user.email); // Debug log
            
            const isAdmin = await checkAdminStatus(user.email);
            console.log("Admin status:", isAdmin); // Debug log

            if (isAdmin) {
                navigate("/admin");
            } else {
                // Store user data for non-admin users
                localStorage.setItem('userId', user.uid);
                localStorage.setItem('userEmail', user.email);
                navigate("/user");
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            alert('Error signing in with Google. Please try again.');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
        }
    };

    return (

        <div className="login-container"
        style={{ 
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}
        
        >
            <div className="login-overlay">
            <div className="login-form">
                <img src={logo} alt="Logo" className="logo" />  
                <h2>Welcome</h2>
                <button 
                    onClick={handleGoogleSignIn} 
                    className="google-signin-btn"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    </div>
    );
};

export default Login;
