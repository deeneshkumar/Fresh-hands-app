import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Clock, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useOrder } from '../../context/OrderContext';
import OrderDetailsModal from '../main/OrderDetailsModal';

export default function OrdersScreen() {
    const navigation = useNavigation();
    const { orderHistory } = useOrder();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleOrderClick(item)}
        >
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
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>My Orders</Text>
                <View style={{ width: 24 }} />
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

            {/* Order Details Modal */}
            <OrderDetailsModal
                visible={modalVisible}
                order={selectedOrder}
                onClose={() => setModalVisible(false)}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
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
