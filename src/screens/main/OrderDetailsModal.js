import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { X, MapPin, Phone, User, Clock, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import LiveTrackingMap from '../../components/LiveTrackingMap';

export default function OrderDetailsModal({ visible, onClose, order }) {
    if (!order) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Order Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.text} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Status Section */}
                        <View style={styles.section}>
                            <Text style={styles.statusTitle}>{order.status}</Text>
                            <Text style={styles.eta}>ETA: {order.eta}</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '60%' }]} />
                            </View>
                        </View>

                        {/* Live Tracking Map */}
                        <View style={styles.mapContainer}>
                            <LiveTrackingMap style={styles.map} />
                            <View style={styles.mapOverlay}>
                                <Text style={styles.mapStatusText}>{order.partner ? 'Partner is approaching' : 'Locating partner...'}</Text>
                            </View>
                        </View>

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
                                <Text style={styles.value}>{order.date} at {order.time}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Address</Text>
                                <Text style={styles.value} numberOfLines={2}>{order.address}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Payment</Text>
                                <Text style={styles.value}>{order.paymentMethod?.toUpperCase() || 'CASH'}</Text>
                            </View>

                            {order.billDetails ? (
                                <>
                                    <View style={styles.divider} />
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Item Total</Text>
                                        <Text style={styles.value}>₹{order.billDetails.itemTotal}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Convenience Fee</Text>
                                        <Text style={styles.value}>₹{order.billDetails.convenienceFee}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Taxes</Text>
                                        <Text style={styles.value}>₹{order.billDetails.taxes}</Text>
                                    </View>
                                    <View style={[styles.row, styles.totalRow]}>
                                        <Text style={styles.totalLabel}>Grand Total</Text>
                                        <Text style={styles.totalValue}>₹{order.billDetails.grandTotal}</Text>
                                    </View>
                                </>
                            ) : (
                                <View style={[styles.row, styles.totalRow]}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>₹{order.price}</Text>
                                </View>
                            )}
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
        height: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.l,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    section: {
        marginBottom: THEME.spacing.l,
    },
    statusTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
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
        height: 220,
        marginBottom: THEME.spacing.l,
        borderRadius: THEME.borderRadius.m,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    map: {
        flex: 1,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    mapStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
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
        marginVertical: 8,
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
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});
