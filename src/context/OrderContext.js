import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);

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

        // 1. Partner Assigned (5s)
        setTimeout(() => {
            setActiveOrder(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    status: 'Partner Assigned',
                    partner: {
                        name: 'Rajesh Kumar',
                        rating: 4.8,
                        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100',
                        phone: '+91 9876543210'
                    },
                    eta: '15 mins',
                    statusLog: prev.statusLog.map(s => s.status === 'Partner Assigned' ? { ...s, timestamp: new Date(), completed: true } : s)
                };
            });
        }, 5000);

        // 2. Heading to Location (10s)
        setTimeout(() => {
            setActiveOrder(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    status: 'Heading to location',
                    eta: '10 mins'
                };
            });
        }, 10000);

        // 3. Partner Arrived (20s)
        setTimeout(() => {
            setActiveOrder(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    status: 'Partner Arrived',
                    eta: 'Arrived',
                    statusLog: prev.statusLog.map(s => s.status === 'Partner Arrived' ? { ...s, timestamp: new Date(), completed: true } : s)
                };
            });
        }, 20000);

        // 4. Work in Progress (25s)
        setTimeout(() => {
            setActiveOrder(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    status: 'Work in Progress',
                    eta: 'In progress'
                };
            });
        }, 25000);

        // 5. Service Completed (35s)
        setTimeout(() => {
            setActiveOrder(prev => {
                if (!prev) return null;
                const completedOrder = {
                    ...prev,
                    status: 'Completed',
                    eta: 'Completed',
                    completedAt: new Date(),
                    statusLog: prev.statusLog.map(s => s.status === 'Service Completed' ? { ...s, timestamp: new Date(), completed: true } : s)
                };

                // Add to history
                setOrderHistory(history => [completedOrder, ...history]);
                return completedOrder;
            });
        }, 35000);

        // 6. Remove active order (40s)
        setTimeout(() => {
            setActiveOrder(null);
        }, 40000);
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
        <OrderContext.Provider value={{ activeOrder, orderHistory, createOrder, clearOrder, completeActiveOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);

