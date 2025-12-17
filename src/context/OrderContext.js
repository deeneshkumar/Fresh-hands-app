import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);

    const updateActiveOrder = (updates) => {
        setActiveOrder(prev => {
            if (!prev) return null;
            return {
                ...prev,
                ...updates
            };
        });
    };

    const createOrder = (orderDetails) => {
        const orderId = 'ORD' + Math.floor(10000 + Math.random() * 90000);
        const startTime = new Date();

        setActiveOrder({
            id: orderId,
            ...orderDetails,
            status: 'Looking for partners...',
            eta: 'Calculating...',
            partner: null,
            location: {
                latitude: 13.0827,
                longitude: 80.2707,
            },
            statusLog: [
                { status: 'Order Placed', timestamp: startTime, completed: true },
                { status: 'Partner Assigned', timestamp: null, completed: false },
                { status: 'Partner Arrived', timestamp: null, completed: false },
                { status: 'Service Completed', timestamp: null, completed: false },
            ]
        });
        // Simulation disabled to let screen drive it
    };



    const completeActiveOrder = () => {
        setActiveOrder(prev => {
            if (!prev) return null;
            const completedOrder = {
                ...prev,
                status: 'Completed',
                eta: 'Completed',
                completedAt: new Date(),
                statusLog: prev.statusLog.map(s => s.status === 'Service Completed' ? { ...s, timestamp: new Date(), completed: true } : s)
            };
            setOrderHistory(history => [completedOrder, ...history]);
            return null; // Remove from active
        });
    };

    const clearOrder = () => {
        setActiveOrder(null);
    };

    return (
        <OrderContext.Provider value={{ activeOrder, orderHistory, createOrder, clearOrder, completeActiveOrder, updateActiveOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);

