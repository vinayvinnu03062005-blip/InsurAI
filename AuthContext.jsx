/* ─────────────────────────────────────────────────────────
   AuthContext.jsx — Authentication state management
   ───────────────────────────────────────────────────────── */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('insurai_user');
            const expiry = localStorage.getItem('insurai_session_expiry');
            if (stored && expiry && Date.now() < parseInt(expiry)) {
                return JSON.parse(stored);
            }
            // Session expired — clean up
            localStorage.removeItem('insurai_user');
            localStorage.removeItem('insurai_token');
            localStorage.removeItem('insurai_session_expiry');
            return null;
        } catch {
            return null;
        }
    });

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('insurai_user', JSON.stringify(user));
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('insurai_user', JSON.stringify(userData));
        localStorage.setItem('insurai_token', 'insurai_session_' + Date.now());
        localStorage.setItem('insurai_session_expiry', String(Date.now() + SESSION_DURATION));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('insurai_user');
        localStorage.removeItem('insurai_token');
        localStorage.removeItem('insurai_session_expiry');
    };

    const updateUser = (updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('insurai_user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
