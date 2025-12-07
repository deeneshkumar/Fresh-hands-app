import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import { useOrder } from '../../context/OrderContext';

export default function OrderConfirmationScreen({ navigation, route }) {
    const { createOrder } = useOrder();
    // route.params might be undefined if we just navigate here directly, but usually it comes from Booking
    // For now, we'll assume dummy data if missing
    const serviceName = route.params?.service?.name || 'Service';

    useEffect(() => {
        if (route.params?.orderDetails) {
            createOrder(route.params.orderDetails);
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <CheckCircle size={80} color={COLORS.success} />
                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.subtitle}>
                    We are searching for a partner nearby. You can track your order on the home screen.
                </Text>
                <Button
                    title="Go to Home"
                    onPress={() => navigation.navigate('Main')}
                    style={styles.button}
                />
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: THEME.spacing.xl,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: THEME.spacing.l,
        marginBottom: THEME.spacing.s,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: THEME.spacing.xl,
    },
    button: {
        width: '100%',
    },
});
