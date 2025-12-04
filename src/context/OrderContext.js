import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [activeOrder, setActiveOrder] = useState(null);

    const createOrder = (service, date, time, address, paymentMethod) => {
        setActiveOrder({
            id: Math.random().toString(),
            serviceName: service.name,
            price: service.price,
            status: 'Searching for partner...',
            eta: 'Calculating...',
            partner: null,
            date,
            time,
            address,
            paymentMethod,
            location: { // Dummy location
                latitude: 13.0827,
                longitude: 80.2707,
            }
        });

        // Simulate order updates
        setTimeout(() => {
            setActiveOrder(prev => prev ? { ...prev, status: 'Partner Assigned', partner: 'Rajesh Kumar', eta: '15 mins' } : null);
        }, 5000);

        setTimeout(() => {
            setActiveOrder(prev => prev ? { ...prev, status: 'On the way', eta: '10 mins' } : null);
        }, 10000);
    };

    const clearOrder = () => {
        setActiveOrder(null);
    };

    return (
        <OrderContext.Provider value={{ activeOrder, createOrder, clearOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
