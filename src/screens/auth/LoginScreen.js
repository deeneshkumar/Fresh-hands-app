import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

import { isValidPhoneNumber } from '../../utils/validation';

export default function LoginScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleLogin = () => {
        if (isValidPhoneNumber(phoneNumber)) {
            navigation.navigate('OTP', { phoneNumber });
        } else {
            alert('Please enter a valid 10-digit mobile number');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.logoText}>Fresh Hands</Text>
                    <Text style={styles.tagline}>Home services at your fingertips</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Enter your mobile number</Text>
                    <Input
                        placeholder="+91 98765 43210"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={10}
                    />
                    <Button title="Continue" onPress={handleLogin} style={styles.button} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: THEME.spacing.l,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: THEME.spacing.xl * 2,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: THEME.spacing.s,
    },
    tagline: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: THEME.spacing.m,
        color: COLORS.text,
    },
    button: {
        marginTop: THEME.spacing.m,
    },
});
