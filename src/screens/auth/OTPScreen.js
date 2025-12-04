import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

import { isValidOTP } from '../../utils/validation';

export default function OTPScreen({ navigation, route }) {
    const { phoneNumber } = route.params || { phoneNumber: '+91 XXXXX XXXXX' };
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleVerify = () => {
        if (isValidOTP(otp)) {
            // In a real app, verify against backend here
            navigation.replace('ProfileDetails', { phoneNumber });
        } else {
            alert('Please enter a valid 4-digit OTP');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Verify Phone Number</Text>
                <Text style={styles.subtitle}>
                    Enter the 4-digit code sent to {phoneNumber}
                </Text>

                <Input
                    placeholder="0000"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    style={styles.input}
                    maxLength={4}
                />

                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                        Resend code in {timer}s
                    </Text>
                    {timer === 0 && (
                        <TouchableOpacity onPress={() => setTimer(30)}>
                            <Text style={styles.resendLink}>Resend</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Button title="Verify" onPress={handleVerify} style={styles.button} />
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
        padding: THEME.spacing.l,
        flex: 1,
    },
    title: {
        ...THEME.typography.h1,
        marginBottom: THEME.spacing.s,
    },
    subtitle: {
        ...THEME.typography.body,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.xl,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.l,
    },
    timerText: {
        color: COLORS.textLight,
    },
    resendLink: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    button: {
        marginTop: THEME.spacing.m,
    },
});
