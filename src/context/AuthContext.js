import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        // Simulate checking for stored user
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setLocation(null);
    };

    const updateLocation = (loc) => {
        setLocation(loc);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, location, updateLocation }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
