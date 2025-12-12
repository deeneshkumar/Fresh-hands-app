import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import ServiceDetailScreen from '../screens/main/ServiceDetailScreen';
import BookingScreen from '../screens/main/BookingScreen';
import PaymentScreen from '../screens/main/PaymentScreen';
import OrderConfirmationScreen from '../screens/main/OrderConfirmationScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ProfileDetailsScreen from '../screens/main/ProfileDetailsScreen';
import OrdersScreen from '../screens/profile/OrdersScreen';
import VouchersScreen from '../screens/profile/VouchersScreen';
import RewardsScreen from '../screens/profile/RewardsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import WalletScreen from '../screens/profile/WalletScreen';
import AddMoneyScreen from '../screens/profile/AddMoneyScreen';
import ChatScreen from '../screens/main/ChatScreen';
import SubscriptionScreen from '../screens/main/SubscriptionScreen';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/auth/SplashScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user, isLoading } = useAuth();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            // Add 1 more second delay after loading finishes
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 1000); // Reduced to 1s for faster entry
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabNavigator} />
                        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
                        <Stack.Screen name="Booking" component={BookingScreen} />
                        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
                        <Stack.Screen name="Payment" component={PaymentScreen} />
                        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
                        <Stack.Screen name="Orders" component={OrdersScreen} />
                        <Stack.Screen name="Vouchers" component={VouchersScreen} />
                        <Stack.Screen name="Rewards" component={RewardsScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                        <Stack.Screen name="Chat" component={ChatScreen} options={{ presentation: 'modal' }} />
                        <Stack.Screen name="Support" component={SupportScreen} />
                        <Stack.Screen name="Wallet" component={WalletScreen} />
                        <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
