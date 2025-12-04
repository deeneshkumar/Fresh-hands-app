import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Phone } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { useOrder } from '../context/OrderContext';
import OrderDetailsModal from '../screens/main/OrderDetailsModal';

export default function OrderTrackingCard() {
    const { activeOrder } = useOrder();
    const [modalVisible, setModalVisible] = useState(false);

    if (!activeOrder) return null;

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)} activeOpacity={0.9}>
                <View style={styles.header}>
                    <Text style={styles.status}>{activeOrder.status}</Text>
                    <Text style={styles.eta}>ETA: {activeOrder.eta}</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.partnerInfo}>
                        <View style={styles.avatar}>
                            <User color={COLORS.white} size={20} />
                        </View>
                        <View>
                            <Text style={styles.partnerName}>{activeOrder.partner || 'Finding partner...'}</Text>
                            <Text style={styles.serviceName}>{activeOrder.serviceName}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.callButton}>
                        <Phone color={COLORS.primary} size={20} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            <OrderDetailsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                order={activeOrder}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 80, // Moved up to avoid tab bar
        left: THEME.spacing.m,
        right: THEME.spacing.m,
        backgroundColor: COLORS.text, // Dark background
        borderRadius: THEME.borderRadius.m,
        padding: THEME.spacing.m,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.s,
    },
    status: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    eta: {
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    partnerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.textLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.s,
    },
    partnerName: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    serviceName: {
        color: COLORS.textLight,
        fontSize: 12,
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
