import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState(null);

    // Initial Mock Addresses (Only used if nothing in storage)
    const INITIAL_ADDRESSES = [
        { id: '1', type: 'Home', flat: '402', street: 'Sunshine Apts, Anna Nagar', city: 'Chennai', pincode: '600040', address: 'Flat 402, Sunshine Apts, Anna Nagar, Chennai - 600040' },
        { id: '2', type: 'Work', flat: '', street: 'Tech Park, OMR', city: 'Chennai', pincode: '600097', address: 'Tech Park, OMR, Chennai - 600097' }
    ];

    const [savedAddresses, setSavedAddresses] = useState([]);

    // Load Data on Mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load User
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) setUser(JSON.parse(storedUser));

                // Load Addresses
                const storedAddr = await AsyncStorage.getItem('savedAddresses');
                if (storedAddr) {
                    setSavedAddresses(JSON.parse(storedAddr));
                } else {
                    setSavedAddresses(INITIAL_ADDRESSES); // Fallback to mock for testing
                }
            } catch (e) {
                console.error("Failed to load auth data", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Helper to persist user
    const persistUser = (userData) => {
        setUser(userData);
        if (userData) AsyncStorage.setItem('user', JSON.stringify(userData));
        else AsyncStorage.removeItem('user');
    };

    // Helper to persist addresses
    const persistAddresses = (addrs) => {
        setSavedAddresses(addrs);
        AsyncStorage.setItem('savedAddresses', JSON.stringify(addrs));
    };

    const login = (userData) => {
        persistUser(userData);
    };

    const logout = () => {
        persistUser(null);
        setLocation(null);
    };

    const updateLocation = (loc) => {
        setLocation(loc);
        // Do we persist current location? Usually transient, but can be nice. 
        // Let's keep it transient for now per session.
    };

    const updateUserProfile = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        persistUser(newUser);
    };

    const addToWallet = (amount) => {
        if (!user) return;
        const newUser = { ...user, walletBalance: (user.walletBalance || 0) + parseFloat(amount) };
        persistUser(newUser);
    };

    const deductFromWallet = (amount) => {
        if (!user || (user.walletBalance || 0) < amount) return false;
        const newUser = { ...user, walletBalance: (user.walletBalance || 0) - parseFloat(amount) };
        persistUser(newUser);
        return true;
    };

    const joinClub = () => {
        if (!user) return;
        const newUser = { ...user, isClubMember: true };
        persistUser(newUser);
    };

    const saveAddress = (newAddr) => {
        // FIFO logic (Max 3)
        let updated = [...savedAddresses, newAddr];
        if (updated.length > 3) {
            updated = updated.slice(updated.length - 3);
        }
        persistAddresses(updated);
    };

    const deleteAddress = (id) => {
        const updated = savedAddresses.filter(a => a.id !== id);
        persistAddresses(updated);
    };

    const editAddress = (id, updatedFields) => {
        const updated = savedAddresses.map(a => a.id === id ? { ...a, ...updatedFields } : a);
        persistAddresses(updated);
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
