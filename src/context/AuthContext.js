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

    const updateUserProfile = (updatedData) => {
        setUser(prevUser => ({ ...prevUser, ...updatedData }));
    };

    const addToWallet = (amount) => {
        setUser(prevUser => ({
            ...prevUser,
            walletBalance: (prevUser?.walletBalance || 0) + parseFloat(amount)
        }));
    };

    const deductFromWallet = (amount) => {
        if (!user || (user.walletBalance || 0) < amount) return false;
        setUser(prevUser => ({
            ...prevUser,
            walletBalance: (prevUser?.walletBalance || 0) - parseFloat(amount)
        }));
        return true;
    };

    const joinClub = () => {
        setUser(prevUser => ({ ...prevUser, isClubMember: true }));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, location, updateLocation, updateUserProfile, addToWallet, deductFromWallet, joinClub }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
