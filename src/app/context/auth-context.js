'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null while checking
    const [user, setUser] = useState(null);

    const pathname = usePathname();

    const checkAuth = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/auth/check`, {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();

                setUser({ userId: data.userId, username: data.username });
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                return null;
            }
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        // 👇 Only check auth on protected pages
        if (pathname !== '/') {
            checkAuth();
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [pathname]);

   



    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
