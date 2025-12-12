import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function PaymentScreen({ route, navigation }) {
    const { orderDetails } = route.params;
    const { deductFromWallet } = useAuth();
    const [status, setStatus] = useState('processing'); // processing, success, failed

    useEffect(() => {
        // Simulate payment processing time
        const timer = setTimeout(() => {
            let isSuccess = false;

            if (orderDetails.paymentMethod === 'wallet') {
                const deducted = deductFromWallet(orderDetails.billDetails.grandTotal);
                isSuccess = deducted;
            } else {
                // Randomly succeed or fail (Mostly succeed for demo)
                isSuccess = Math.random() > 0.1;
            }

            setStatus(isSuccess ? 'success' : 'failed');

            if (isSuccess) {
                setTimeout(() => {
                    navigation.replace('OrderConfirmation', { orderDetails });
                }, 1500);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleRetry = () => {
        setStatus('processing');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                navigation.replace('OrderConfirmation', { orderDetails });
            }, 1500);
        }, 3000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {status === 'processing' && (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.text}>Processing Payment...</Text>
                        <Text style={styles.subText}>Please do not close this screen</Text>
                    </View>
                )}

                {status === 'success' && (
                    <View style={styles.center}>
                        <View style={styles.iconCircle}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }}
                                style={styles.icon}
                            />
                        </View>
                        <Text style={styles.successText}>Payment Successful!</Text>
                        <Text style={styles.subText}>Redirecting...</Text>
                    </View>
                )}

                {status === 'failed' && (
                    <View style={styles.center}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190406.png' }}
                                style={[styles.icon, { tintColor: COLORS.error }]}
                            />
                        </View>
                        <Text style={styles.errorText}>Payment Failed</Text>
                        <Text style={styles.subText}>Something went wrong with the transaction.</Text>
                        <Button title="Retry Payment" onPress={handleRetry} style={styles.retryButton} />
                        <Button title="Cancel" variant="outline" onPress={() => navigation.goBack()} style={styles.retryButton} />
                    </View>
                )}

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
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    successText: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    errorText: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.error,
    },
    subText: {
        marginTop: 10,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    retryButton: {
        marginTop: 20,
        width: '100%',
    }
});
