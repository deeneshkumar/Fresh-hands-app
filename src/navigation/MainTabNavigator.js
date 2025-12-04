import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Hand, Compass, Users, Tag } from 'lucide-react-native';
import HomeScreen from '../screens/main/HomeScreen';
import FreshHandsScreen from '../screens/main/FreshHandsScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import PartnerScreen from '../screens/main/PartnerScreen';
import OffersScreen from '../screens/main/OffersScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.textLight,
                    tabBarStyle: {
                        paddingBottom: 5,
                        paddingTop: 4,
                        height: 70,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        paddingBottom: 5,
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Fresh Hands"
                    component={FreshHandsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Hand color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Explore"
                    component={ExploreScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Partner"
                    component={PartnerScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Offers"
                    component={OffersScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Tag color={color} size={size} />,
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}
