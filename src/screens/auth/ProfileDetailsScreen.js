import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

import { useAuth } from '../../context/AuthContext';

import { isValidName, isValidEmail, isValidCity } from '../../utils/validation';

export default function ProfileDetailsScreen() {
    const { login } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

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

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            login({ name, email, phone: route.params?.phoneNumber });
            setLoading(false);
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: THEME.spacing.l,
    },
    button: {
        marginTop: THEME.spacing.l,
    },
});
