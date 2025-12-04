import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Clock, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

const ORDERS = [
    { id: '1', service: 'Home Cleaning', date: '2023-10-25', status: 'Completed', price: '999' },
    { id: '2', service: 'Plumbing Repair', date: '2023-11-02', status: 'Completed', price: '299' },
    { id: '3', service: 'AC Service', date: '2023-11-15', status: 'Cancelled', price: '599' },
];

export default function OrdersScreen() {
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.serviceRow}>
                    <Package color={COLORS.primary} size={20} />
                    <Text style={styles.serviceName}>{item.service}</Text>
                </View>
                <Text style={[styles.status, { color: item.status === 'Completed' ? COLORS.success : COLORS.error }]}>
                    {item.status}
                </Text>
            </View>
            <View style={styles.cardFooter}>
                <View style={styles.metaRow}>
                    <Clock color={COLORS.textLight} size={14} />
                    <Text style={styles.date}>{item.date}</Text>
                </View>
                <Text style={styles.price}>₹{item.price}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Orders</Text>
            </View>
            <FlatList
                data={ORDERS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No orders found</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    list: {
        padding: THEME.spacing.m,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.s,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    status: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    date: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: COLORS.textLight,
    },
});
