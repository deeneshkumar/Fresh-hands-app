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

    // Mock Initial Addresses
    const [savedAddresses, setSavedAddresses] = useState([
        { id: '1', type: 'Home', flat: '402', street: 'Sunshine Apts, Anna Nagar', city: 'Chennai', pincode: '600040', address: 'Flat 402, Sunshine Apts, Anna Nagar, Chennai - 600040' },
        { id: '2', type: 'Work', flat: '', street: 'Tech Park, OMR', city: 'Chennai', pincode: '600097', address: 'Tech Park, OMR, Chennai - 600097' }
    ]);

    const saveAddress = (newAddr) => {
        setSavedAddresses(prev => {
            // "Save last three entered" -> Keep max 3. 
            // If adding new, and count >= 3, remove oldest? 
            // Or just allow 3? User said "upto save last three enteres address". 
            // Usually implies a Recent History or a limited list.
            // I'll assume standard list limited to 3. If full, remove oldest or prevent?
            // "automatically in the saved address , upto save last three" implies rolling buffer.
            // So if 3 exist, remove first, add new.
            let updated = [...prev, newAddr];
            if (updated.length > 3) {
                updated = updated.slice(updated.length - 3); // Keep last 3
            }
            return updated;
        });
    };

    const deleteAddress = (id) => {
        setSavedAddresses(prev => prev.filter(a => a.id !== id));
    };

    const editAddress = (id, updatedFields) => {
        setSavedAddresses(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
    };

    return (
        <AuthContext.Provider value={{
            user, isLoading, login, logout,
            location, updateLocation,
            updateUserProfile, addToWallet, deductFromWallet, joinClub,
            savedAddresses, saveAddress, deleteAddress, editAddress
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
