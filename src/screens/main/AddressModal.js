import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { MapPin, X, Plus, Navigation, ArrowLeft, Trash2, Edit2 } from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';

export default function AddressModal({ visible, onClose, onSelectLocation }) {
    const { savedAddresses, saveAddress, deleteAddress, editAddress } = useAuth();
    const [selectedId, setSelectedId] = useState(null);

    // Mode: 'list' | 'add' | 'edit'
    const [viewMode, setViewMode] = useState('list');
    const [editingId, setEditingId] = useState(null);

    // Loading states
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Form State
    const [type, setType] = useState('');
    const [flat, setFlat] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');

    const resetForm = () => {
        setType('');
        setFlat('');
        setStreet('');
        setCity('');
        setPincode('');
        setEditingId(null);
        setViewMode('list');
    };

    const handleConfirm = () => {
        if (selectedId) {
            const addr = savedAddresses.find(a => a.id === selectedId);
            if (addr) onSelectLocation(addr);
            onClose();
        }
    };

    const handleAddNewClick = () => {
        // Automatically save -> context handles limit (FIFO)
        resetForm();
        setViewMode('add');
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setType(item.type);
        setFlat(item.flat || '');
        setStreet(item.street || '');
        setCity(item.city || '');
        setPincode(item.pincode || '');
        setViewMode('edit');
    };

    const handleDeleteClick = (id) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(id) }
            ]
        );
    };

    const handleSaveForm = () => {
        if (!type.trim() || !flat.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
            Alert.alert('Missing Details', 'Please fill all fields.');
            return;
        }

        const fullAddress = `${flat}, ${street}, ${city} - ${pincode}`;
        const addressData = {
            type,
            flat,
            street,
            city,
            pincode,
            address: fullAddress
        };

        if (viewMode === 'edit' && editingId) {
            editAddress(editingId, addressData);
        } else {
            // New Add
            const newEntry = {
                id: Date.now().toString(),
                ...addressData
            };
            saveAddress(newEntry);
            setSelectedId(newEntry.id);
        }
        resetForm();
    };

    const handleUseCurrentLocation = async () => {
        setLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location access is required.');
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = loc.coords;

            // Reverse geocode
            const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (addressResponse && addressResponse.length > 0) {
                const addr = addressResponse[0];

                // Pre-fill form (Try to detect House/Flat/Building Name)
                setFlat(addr.name || addr.streetNumber || '');
                setStreet(addr.street || addr.district || '');
                setCity(addr.city || addr.subregion || '');
                setPincode(addr.postalCode || '');
                setType('Current Location'); // Default title

                // Switch to form to let user enter House No
                setViewMode('add');
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch location.');
        } finally {
            setLoadingLocation(false);
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

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {(viewMode === 'add' || viewMode === 'edit') && (
                                <TouchableOpacity onPress={resetForm} style={{ marginRight: 10 }}>
                                    <ArrowLeft color={COLORS.text} size={24} />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.title}>
                                {viewMode === 'add' ? 'Add New Address' : viewMode === 'edit' ? 'Edit Address' : 'Select Address'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.text} size={24} />
                        </TouchableOpacity>
                    </View>

                    {viewMode === 'list' ? (
                        <>
                            <ScrollView contentContainerStyle={styles.content}>
                                {/* Use Current Location (Transient) */}
                                <TouchableOpacity
                                    style={styles.currentLocationBtn}
                                    onPress={handleUseCurrentLocation}
                                    disabled={loadingLocation}
                                >
                                    {loadingLocation ? (
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                    ) : (
                                        <Navigation color={COLORS.primary} size={20} fill={COLORS.primary + '20'} />
                                    )}
                                    <Text style={styles.currentLocationText}>
                                        {loadingLocation ? 'Detecting...' : 'Use Current Location'}
                                    </Text>
                                </TouchableOpacity>

                                {/* Divider */}
                                <View style={styles.divider} />
                                <Text style={styles.sectionLabel}>Saved Addresses ({savedAddresses.length})</Text>

                                {/* Address List */}
                                {savedAddresses.map((item) => (
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
                                            <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
                                        </View>

                                        {/* Actions */}
                                        <View style={styles.cardActions}>
                                            <TouchableOpacity onPress={() => handleEditClick(item)} style={styles.actionBtn}>
                                                <Edit2 size={16} color={COLORS.primary} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDeleteClick(item.id)} style={styles.actionBtn}>
                                                <Trash2 size={16} color={COLORS.error} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                {/* Add New Button */}
                                <TouchableOpacity
                                    style={styles.addNewButton}
                                    onPress={handleAddNewClick}
                                >
                                    <Plus color={COLORS.primary} size={20} />
                                    <Text style={styles.addNewText}>Add New Address</Text>
                                </TouchableOpacity>
                            </ScrollView>

                            <View style={styles.footer}>
                                <Button
                                    title="Confirm Location"
                                    onPress={handleConfirm}
                                    disabled={!selectedId}
                                />
                            </View>
                        </>
                    ) : (
                        // ADD / EDIT FORM
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                            <Input
                                label="Address Title"
                                placeholder="e.g. Home, Work"
                                value={type}
                                onChangeText={setType}
                                style={styles.inputSpacing}
                            />
                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Input
                                        label="House / Flat No"
                                        placeholder="e.g. 4B"
                                        value={flat}
                                        onChangeText={setFlat}
                                        style={styles.inputSpacing}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        label="Pincode"
                                        placeholder="000000"
                                        keyboardType="numeric"
                                        maxLength={6}
                                        value={pincode}
                                        onChangeText={setPincode}
                                        style={styles.inputSpacing}
                                    />
                                </View>
                            </View>

                            <Input
                                label="Area / Street"
                                placeholder="e.g. Gandhi Road"
                                value={street}
                                onChangeText={setStreet}
                                style={styles.inputSpacing}
                            />

                            <Input
                                label="City"
                                placeholder="e.g. Chennai"
                                value={city}
                                onChangeText={setCity}
                                style={styles.inputSpacing}
                            />

                            <View style={{ height: 20 }} />

                            <Button
                                title={viewMode === 'edit' ? "Update Address" : "Save Address"}
                                onPress={handleSaveForm}
                            />
                        </ScrollView>
                    )}
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
        height: '85%',
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
    currentLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 16,
        backgroundColor: COLORS.surface || '#F5F5F5',
        borderRadius: THEME.borderRadius.m,
    },
    currentLocationText: {
        marginLeft: 12,
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: 16,
    },
    sectionLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
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
        marginTop: 8,
    },
    addNewText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
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
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconBoxActive: {
        backgroundColor: COLORS.primary,
    },
    addressInfo: {
        flex: 1,
        marginRight: 8,
    },
    addressType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    addressText: {
        fontSize: 11,
        color: COLORS.textLight,
        lineHeight: 14,
    },
    cardActions: {
        flexDirection: 'column',
        gap: 8,
        paddingLeft: 8,
        borderLeftWidth: 1,
        borderLeftColor: COLORS.border,
    },
    actionBtn: {
        padding: 4,
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
    inputSpacing: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
    }
});
