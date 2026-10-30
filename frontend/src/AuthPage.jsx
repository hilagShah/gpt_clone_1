import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./AuthPage.css";

const AuthPage = () => {
    const { login, signup } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            if (isSignUp) {
                if (!username.trim() || !email.trim() || !password.trim()) {
                    setError("All fields are required");
                    setIsSubmitting(false);
                    return;
                }
                const res = await signup(username, email, password);
                if (!res.success) {
                    setError(res.error);
                }
            } else {
                if (!email.trim() || !password.trim()) {
                    setError("All fields are required");
                    setIsSubmitting(false);
                    return;
                }
                const res = await login(email, password);
                if (!res.success) {
                    setError(res.error);
                }
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTab = (signUpVal) => {
        setIsSignUp(signUpVal);
        setError("");
        setUsername("");
        setEmail("");
        setPassword("");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-bg-glow"></div>
            <div className="auth-bg-glow-2"></div>
            
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">Sigma AI</h1>
                    <p className="auth-subtitle">
                        {isSignUp ? "Create an account to get started" : "Sign in to continue your conversations"}
                    </p>
                </div>

                <div className="auth-tabs">
                    <button 
                        type="button" 
                        className={`auth-tab-btn ${!isSignUp ? "active" : ""}`}
                        onClick={() => toggleTab(false)}
                    >
                        Sign In
                    </button>
                    <button 
                        type="button" 
                        className={`auth-tab-btn ${isSignUp ? "active" : ""}`}
                        onClick={() => toggleTab(true)}
                    >
                        Sign Up
                    </button>
                </div>

                {error && (
                    <div className="auth-error">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isSignUp && (
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="spinner"></span>
                        ) : (
                            isSignUp ? "Create Account" : "Sign In"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    {isSignUp ? (
                        <>
                            Already have an account?{" "}
                            <span className="auth-footer-link" onClick={() => toggleTab(false)}>
                                Sign In
                            </span>
                        </>
                    ) : (
                        <>
                            Don't have an account?{" "}
                            <span className="auth-footer-link" onClick={() => toggleTab(true)}>
                                Sign Up
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
