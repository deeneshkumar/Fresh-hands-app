import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Clock, ArrowLeft, X, CreditCard, Banknote } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useOrder } from '../../context/OrderContext';
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Order Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <X color={COLORS.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        {selectedOrder && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.detailSection}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Service</Text>
                                        <Text style={styles.detailValue}>{selectedOrder.serviceName || selectedOrder.service?.name || 'Service'}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Date</Text>
                                        <Text style={styles.detailValue}>
                                            {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleString() : 'Just now'}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Status</Text>
                                        <Text style={[styles.detailValue, { color: selectedOrder.status === 'Completed' ? COLORS.success : COLORS.primary }]}>
                                            {selectedOrder.status}
                                        </Text>
                                    </View>
                                </View>

                                {selectedOrder.partner && (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Partner</Text>
                                        <View style={styles.partnerRow}>
                                            <View style={styles.partnerAvatar}>
                                                <Text style={styles.partnerInitial}>{selectedOrder.partner.name?.[0] || 'P'}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.partnerName}>{selectedOrder.partner.name}</Text>
                                                <Text style={styles.partnerStats}>Rating: {selectedOrder.partner.rating} ★</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Payment</Text>
                                    <View style={styles.paymentRow}>
                                        {selectedOrder.paymentMethod === 'cash' ? <Banknote size={20} color={COLORS.text} /> : <CreditCard size={20} color={COLORS.text} />}
                                        <Text style={styles.paymentMethod}>{selectedOrder.paymentMethod?.toUpperCase() || 'CASH'}</Text>
                                    </View>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>Grand Total</Text>
                                        <Text style={styles.totalAmount}>₹{selectedOrder.billDetails?.grandTotal || selectedOrder.price}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Close</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: THEME.spacing.l,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.l,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    closeButton: {
        padding: 4,
    },
    detailSection: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    detailValue: {
        color: COLORS.text,
        fontWeight: '600',
        fontSize: 14,
        maxWidth: '60%',
        textAlign: 'right',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    partnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    partnerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    partnerInitial: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    partnerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    partnerStats: {
        color: COLORS.textLight,
        fontSize: 12,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    paymentMethod: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    cancelButton: {
        backgroundColor: '#FFEBEE', // Light red for cancel feel, or just outline
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    cancelButtonText: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
