'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null while checking
    const [user, setUser] = useState(null);

    const pathname = usePathname();
    const router = useRouter()

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

    const logout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch {
            // even if request fails, clear state
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            router.push('/login');
        }
    };



    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
