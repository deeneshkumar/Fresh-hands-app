import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, X, Plus } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';

// Mock Saved Addresses
const SAVED_ADDRESSES = [
    { id: '1', type: 'Home', address: 'Flat 402, Sunshine Apartments, Anna Nagar, Chennai' },
    { id: '2', type: 'Work', address: 'Tech Park, OMR, Chennai' },
    { id: '3', type: 'Other', address: '12, Gandhi Street, T. Nagar, Chennai' }
];

export default function AddressModal({ visible, onClose, onSelectLocation }) {
    const [selectedId, setSelectedId] = useState(null);

    const handleConfirm = () => {
        if (selectedId) {
            const addr = SAVED_ADDRESSES.find(a => a.id === selectedId);
            onSelectLocation(addr);
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Address</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.text} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <TouchableOpacity style={styles.addNewButton}>
                            <Plus color={COLORS.primary} size={20} />
                            <Text style={styles.addNewText}>Add New Address</Text>
                        </TouchableOpacity>

                        {SAVED_ADDRESSES.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.addressCard,
                                    selectedId === item.id && styles.addressCardActive
                                ]}
                                onPress={() => setSelectedId(item.id)}
                            >
                                <View style={[styles.iconBox, selectedId === item.id && styles.iconBoxActive]}>
                                    <MapPin color={selectedId === item.id ? COLORS.white : COLORS.textLight} size={20} />
                                </View>
                                <View style={styles.addressInfo}>
                                    <Text style={styles.addressType}>{item.type}</Text>
                                    <Text style={styles.addressText}>{item.address}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <Button
                            title="Confirm Location"
                            onPress={handleConfirm}
                            disabled={!selectedId}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '60%',
        padding: THEME.spacing.m,
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
    content: {
        paddingBottom: 80,
    },
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: THEME.borderRadius.m,
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#F0F9FF',
    },
    addNewText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: THEME.borderRadius.m,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
    },
    addressCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFF',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconBoxActive: {
        backgroundColor: COLORS.primary,
    },
    addressInfo: {
        flex: 1,
    },
    addressType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    addressText: {
        fontSize: 12,
        color: COLORS.textLight,
        lineHeight: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: THEME.spacing.m,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
});
