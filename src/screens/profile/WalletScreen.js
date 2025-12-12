import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, History, Wallet as WalletIcon, CreditCard } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';

// Mock Transaction Data
const TRANSACTIONS = [
    { id: '1', title: 'Added to Wallet', date: 'Dec 12, 2024', amount: '+ ₹500', type: 'credit' },
    { id: '2', title: 'Plumbing Service', date: 'Dec 10, 2024', amount: '- ₹250', type: 'debit' },
    { id: '3', title: 'Welcome Bonus', date: 'Dec 01, 2024', amount: '+ ₹100', type: 'credit' },
];

export default function WalletScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const balance = user?.walletBalance || 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Fresh Hands Wallet</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <View>
                        <Text style={styles.balanceLabel}>Current Balance</Text>
                        <Text style={styles.balanceamount}>₹{balance.toFixed(2)}</Text>
                    </View>
                    <View style={styles.walletIconContainer}>
                        <WalletIcon color={COLORS.white} size={32} />
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionContainer}>
                    <Button
                        title="Add Money"
                        icon={<Plus size={20} color={COLORS.white} />}
                        onPress={() => navigation.navigate('AddMoney')}
                        style={styles.actionButton}
                    />
                </View>

                {/* Transactions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {TRANSACTIONS.map(item => (
                    <View key={item.id} style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                            <View style={[styles.iconBox, item.type === 'credit' ? styles.creditIcon : styles.debitIcon]}>
                                {item.type === 'credit' ? <Plus size={20} color={item.type === 'credit' ? '#4CAF50' : '#F44336'} /> : <CreditCard size={20} color='#F44336' />}
                            </View>
                            <View>
                                <Text style={styles.transTitle}>{item.title}</Text>
                                <Text style={styles.transDate}>{item.date}</Text>
                            </View>
                        </View>
                        <Text style={[styles.transAmount, item.type === 'credit' ? styles.textGreen : styles.textRed]}>
                            {item.amount}
                        </Text>
                    </View>
                ))}
            </ScrollView>
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
        padding: THEME.spacing.m,
    },
    balanceCard: {
        backgroundColor: COLORS.primary,
        borderRadius: THEME.borderRadius.l,
        padding: THEME.spacing.l,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.l,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    balanceamount: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: 'bold',
    },
    walletIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionContainer: {
        marginBottom: THEME.spacing.xl,
    },
    actionButton: {
        width: '100%',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.m,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    seeAll: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.s,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    creditIcon: {
        backgroundColor: '#E8F5E9',
    },
    debitIcon: {
        backgroundColor: '#FFEBEE',
    },
    transTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    transDate: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    transAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textGreen: {
        color: '#4CAF50',
    },
    textRed: {
        color: '#F44336',
    },
});
