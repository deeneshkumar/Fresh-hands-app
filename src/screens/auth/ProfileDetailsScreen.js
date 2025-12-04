import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

import { isValidName, isValidEmail, isValidCity } from '../../utils/validation';

export default function ProfileDetailsScreen() {
    const { login } = useAuth();
    const route = useRoute();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        if (!isValidName(name)) {
            Alert.alert('Invalid Name', 'Please enter a valid name (at least 2 characters)');
            return;
        }

        if (email && !isValidEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        if (!isValidCity(city)) {
            Alert.alert('Invalid City', 'Please enter your city');
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            login({ name, email, city, phone: route.params?.phoneNumber });
            setLoading(false);
        }, 1500);
    };

    const handleUseCurrentLocation = () => {
        // Simulate getting location
        setCity('Chennai, India');
        Alert.alert('Location', 'Location detected: Chennai, India');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Complete Profile</Text>
                <Text style={styles.subtitle}>
                    Tell us a bit about yourself
                </Text>

                <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                />

                <Input
                    label="Email (Optional)"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <View>
                    <Input
                        label="City / Location"
                        placeholder="Enter your city"
                        value={city}
                        onChangeText={setCity}
                    />
                    <TouchableOpacity onPress={handleUseCurrentLocation} style={styles.locationLink}>
                        <Text style={styles.locationLinkText}>Use Current Location</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title="Save & Continue"
                    onPress={handleSave}
                    loading={loading}
                    style={styles.button}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: THEME.spacing.l,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.s,
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.xl,
    },
    button: {
        marginTop: THEME.spacing.l,
    },
    locationLink: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    locationLinkText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
