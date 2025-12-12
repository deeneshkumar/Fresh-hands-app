import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Smartphone, Banknote } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';

const PAYMENT_METHODS = [
    { id: 'upi', name: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', name: 'Net Banking', icon: Banknote, desc: 'All Major Banks' },
];

const AMOUNTS = [100, 200, 500, 1000];

export default function AddMoneyScreen() {
    const navigation = useNavigation();
    const { addToWallet } = useAuth();
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
    const [loading, setLoading] = useState(false);

    const handleAddMoney = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
            return;
        }

        setLoading(true);
        // Simulate payment gateway delay
        setTimeout(() => {
            addToWallet(amount);
            setLoading(false);
            Alert.alert(
                'Payment Successful',
                `₹${amount} added to your wallet successfully!`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Money</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Enter Amount</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0"
                        keyboardType="number-pad"
                        autoFocus
                    />
                </View>

                {/* Quick Add Buttons */}
                <View style={styles.quickAddContainer}>
                    {AMOUNTS.map(amt => (
                        <TouchableOpacity
                            key={amt}
                            style={styles.quickAddChip}
                            onPress={() => setAmount(amt.toString())}
                        >
                            <Text style={styles.quickAddText}>+ ₹{amt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Select Payment Method</Text>
                <View style={styles.methodsContainer}>
                    {PAYMENT_METHODS.map(method => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;
                        return (
                            <TouchableOpacity
                                key={method.id}
                                style={[styles.methodItem, isSelected && styles.methodItemSelected]}
                                onPress={() => setSelectedMethod(method.id)}
                            >
                                <View style={styles.methodLeft}>
                                    <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                                        <Icon color={isSelected ? COLORS.primary : COLORS.text} size={24} />
                                    </View>
                                    <View>
                                        <Text style={[styles.methodName, isSelected && styles.methodNameSelected]}>
                                            {method.name}
                                        </Text>
                                        <Text style={styles.methodDesc}>{method.desc}</Text>
                                    </View>
                                </View>
                                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={loading ? "Processing..." : `Pay ₹${amount || '0'}`}
                    onPress={handleAddMoney}
                    disabled={loading || !amount}
                    loading={loading}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.m,
        paddingVertical: THEME.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: THEME.spacing.l,
    },
    label: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.s,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        paddingVertical: THEME.spacing.s,
        marginBottom: THEME.spacing.m,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginRight: 8,
    },
    input: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    quickAddContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: THEME.spacing.xl,
    },
    quickAddChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    quickAddText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.m,
    },
    methodsContainer: {
        gap: 12,
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    methodItemSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#F0F9FF',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBoxSelected: {
        backgroundColor: COLORS.white,
    },
    methodName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    methodNameSelected: {
        color: COLORS.primary,
    },
    methodDesc: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.textLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
    footer: {
        padding: THEME.spacing.l,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.white,
    }
});
