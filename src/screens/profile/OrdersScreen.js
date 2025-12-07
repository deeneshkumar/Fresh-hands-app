import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Clock } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useOrder } from '../../context/OrderContext';

export default function OrdersScreen() {
    const { orderHistory } = useOrder();

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.serviceRow}>
                    <Package color={COLORS.primary} size={20} />
                    <Text style={styles.serviceName}>{item.serviceName || item.service?.name || 'Service'}</Text>
                </View>
                <Text style={[styles.status, { color: item.status === 'Completed' ? COLORS.success : COLORS.error }]}>
                    {item.status}
                </Text>
            </View>
            <View style={styles.cardFooter}>
                <View style={styles.metaRow}>
                    <Clock color={COLORS.textLight} size={14} />
                    <Text style={styles.date}>
                        {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.price}>₹{item.price || item.service?.price || '0'}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Orders</Text>
            </View>
            <FlatList
                data={orderHistory}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Package color={COLORS.textLight} size={48} style={{ opacity: 0.5 }} />
                        <Text style={styles.emptyText}>No past orders found</Text>
                        <Text style={styles.emptySubText}>Book a service to see it here</Text>
                    </View>
                }
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
        flexGrow: 1,
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
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: THEME.spacing.m,
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptySubText: {
        textAlign: 'center',
        marginTop: 4,
        color: COLORS.textLight,
        fontSize: 14,
    },
});
