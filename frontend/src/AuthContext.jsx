import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "./config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserSession = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Session check failed", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserSession();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Login failed" };
            }
        } catch (err) {
            console.error(err);
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Signup failed" };
            }
        } catch (err) {
            console.error(err);
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.error("Failed to call logout endpoint", err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, checkUserSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
