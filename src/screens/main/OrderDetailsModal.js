import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { X, Phone, User, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import LiveTrackingMap from '../../components/LiveTrackingMap';
import Button from '../../components/Button';
import { useOrder } from '../../context/OrderContext';

export default function OrderDetailsModal({ visible, onClose, order }) {
    const { completeActiveOrder } = useOrder();
    const [isArrived, setIsArrived] = useState(false);

    // Reset when order changes
    useEffect(() => {
        if (order?.status === 'Completed') {
            setIsArrived(true);
        } else {
            setIsArrived(false);
        }
    }, [order]);

    const handleArrival = () => {
        setIsArrived(true);
    };

    const handleCompleteOrder = () => {
        completeActiveOrder();
        onClose();
    };

    if (!order) return null;

    const isOrderCompleted = order.status === 'Completed';

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Order # {order.id?.slice(-6) || 'DETAILS'}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.text} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {/* Status Section */}
                        <View style={styles.section}>
                            <View style={styles.statusHeader}>
                                <Text style={styles.statusTitle}>
                                    {isArrived ? 'Partner Arrived' : order.status}
                                </Text>
                                {isArrived && <CheckCircle color={COLORS.success} size={24} />}
                            </View>

                            {!isArrived && (
                                <>
                                    <Text style={styles.eta}>ETA: {order.eta}</Text>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: '60%' }]} />
                                    </View>
                                </>
                            )}
                        </View>

                        {/* Live Tracking Map - Hide if completed */}
                        {!isOrderCompleted && !isArrived && (
                            <View style={styles.mapContainer}>
                                <LiveTrackingMap style={styles.map} onArrived={handleArrival} />
                            </View>
                        )}

                        {/* Arrived / Completion Actions */}
                        {isArrived && !isOrderCompleted && (
                            <View style={styles.completionContainer}>
                                <Text style={styles.arrivedText}>Partner has reached your location.</Text>
                                <Button
                                    title="Mark as Completed"
                                    onPress={handleCompleteOrder}
                                    style={styles.completeButton}
                                />
                            </View>
                        )}

                        {/* Partner Info */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Your Partner</Text>
                            <View style={styles.partnerRow}>
                                <View style={styles.avatar}>
                                    {order.partner?.image ? (
                                        <Image source={{ uri: order.partner.image }} style={styles.avatarImage} />
                                    ) : (
                                        <User color={COLORS.white} size={24} />
                                    )}
                                </View>
                                <View style={styles.partnerInfo}>
                                    <Text style={styles.partnerName}>
                                        {typeof order.partner === 'object' ? order.partner?.name : (order.partner || 'Assigning...')}
                                    </Text>
                                    <Text style={styles.partnerRating}>
                                        ⭐ {typeof order.partner === 'object' ? order.partner?.rating : '4.8'} (120 reviews)
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.callButton}>
                                    <Phone color={COLORS.primary} size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Order Info */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Order Summary</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Service</Text>
                                <Text style={styles.value}>{order.service?.name || order.serviceName}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Date & Time</Text>
                                <Text style={styles.value}>{order.date ? new Date(order.date).toLocaleDateString() : 'Today'} at {order.time}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Address</Text>
                                <Text style={styles.value} numberOfLines={2}>{order.address}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Payment</Text>
                                <Text style={styles.value}>{order.paymentMethod?.toUpperCase() || 'CASH'}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={[styles.row, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>₹{order.billDetails?.grandTotal || order.price || '0'}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: THEME.borderRadius.l,
        borderTopRightRadius: THEME.borderRadius.l,
        padding: THEME.spacing.m,
        height: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.l,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    section: {
        marginBottom: THEME.spacing.l,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4,
    },
    statusTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    eta: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.m,
    },
    progressBar: {
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.success,
    },
    mapContainer: {
        height: 380, // Increased height for map + stats
        marginBottom: THEME.spacing.l,
    },
    map: {
        flex: 1,
    },
    completionContainer: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        alignItems: 'center',
        marginBottom: THEME.spacing.m,
        borderWidth: 1,
        borderColor: COLORS.success,
    },
    arrivedText: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 15,
        textAlign: 'center',
    },
    completeButton: {
        width: '100%',
        backgroundColor: COLORS.success,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.m,
        color: COLORS.text,
    },
    partnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.textLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.m,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    partnerInfo: {
        flex: 1,
    },
    partnerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    partnerRating: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: COLORS.textLight,
        flex: 1,
    },
    value: {
        color: COLORS.text,
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    totalRow: {
        marginTop: 4,
        paddingTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});
