import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { OrderProvider } from './src/context/OrderContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform, AppState } from 'react-native';

export default function App() {
  useEffect(() => {
    const configureSystemUI = async () => {
      if (Platform.OS === 'android') {
        // Enforce Navigation Bar Hidden
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setBackgroundColorAsync('#000000'); // Ensure black if it appears
      }
    };

    configureSystemUI();

    // Re-apply on app resume
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        configureSystemUI();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OrderProvider>
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
          <RootNavigator />
        </OrderProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
