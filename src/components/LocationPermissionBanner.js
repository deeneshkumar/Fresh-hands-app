import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, AppState, Modal, ScrollView, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { MapPin, Navigation, X, Home, Briefcase, MapPinned, ArrowRight, Check } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Button from './Button'; // Assuming Button component exists, or use standard TouchableOpacity
import Input from './Input';   // Assuming Input component exists, or use standard TextInput

// Mock Saved Addresses (Ideally this comes from User Context/API)
const MOCK_SAVED_ADDRESSES = [
    { id: '1', type: 'Home', address: 'Flat 101, Green Apts, Chennai', lat: 13.0827, lng: 80.2707 },
    { id: '2', type: 'Work', address: 'Tech Park, OMR, Chennai', lat: 12.9716, lng: 80.2423 },
];

export default function LocationPermissionBanner() {
    const { updateLocation, location } = useAuth();
    const [visible, setVisible] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState('undetermined');
    const [loading, setLoading] = useState(false);

    // Form State
    const [houseNo, setHouseNo] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');

    // Mode: 'initial' | 'manual'
    const [mode, setMode] = useState('initial');

    const checkPermissionAndLocation = useCallback(async () => {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            setPermissionStatus(status);

            // If we don't have a location set in context OR permission is not granted, show modal
            // User requested: "disappears... once done its job"
            if ((status !== 'granted' || !location) && status !== 'denied') {
                // Note: If 'denied' purely, we might not want to pester every time unless we have a specific logic,
                // But request says "banner enlarge", so we show it if needed.
                // Simpler: Show if !location.
                if (!location) {
                    setVisible(true);
                }
            } else if (location) {
                setVisible(false);
            }
        } catch (error) {
            console.log('Error checking permission:', error);
        }
    }, [location]);

    useFocusEffect(
        useCallback(() => {
            checkPermissionAndLocation();
        }, [checkPermissionAndLocation])
    );

    // Auto-fill from location object if available (e.g. from valid previous fetch)
    useEffect(() => {
        if (location) {
            setCity(location.city || '');
            setPincode(location.postalCode || '');
            // We don't auto-fill House/Area usually from rough GPS
        }
    }, [location]);

    const handleGrantAccess = async () => {
        setLoading(true);
        try {
            // 1. Request Permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            setPermissionStatus(status);

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'We need location access to find you. Please allow access in settings or enter address manually.',
                    [
                        { text: 'Enter Manually', onPress: () => setMode('manual') },
                        { text: 'Settings', onPress: () => Linking.openSettings() },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                setLoading(false);
                return;
            }

            // 2. Enable GPS (Android)
            if (Platform.OS === 'android') {
                const providerStatus = await Location.enableNetworkProviderAsync();
                // providerStatus doesn't always return useful info immediately on older expo versions, 
                // but checking hasServicesEnabledAsync is better.
            }

            // 3. Fetch Location
            const curLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const { latitude, longitude } = curLoc.coords;

            // 4. Reverse Geocode
            const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addressResponse.length > 0) {
                const addr = addressResponse[0];
                setCity(addr.city || addr.subregion || '');
                setPincode(addr.postalCode || '');
                setArea(addr.street || addr.district || '');
                // Try to detect house/flat
                setHouseNo(addr.name || addr.streetNumber || '');

                // Switch to Review/Manual fill mode to let user confirm House No
                setMode('manual');

                // Optional: Update global immediately? 
                // Better to let user hit "Confirm"
            }
        } catch (error) {
            console.log('Location Error:', error);
            Alert.alert('Error', 'Could not fetch location. Please enter manually.');
            setMode('manual');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSaved = (savedAddr) => {
        // Parse if needed or just use
        updateLocation({
            address: savedAddr.address,
            latitude: savedAddr.lat,
            longitude: savedAddr.lng
        });
        setVisible(false);
    };

    const handleManualSubmit = () => {
        if (!houseNo.trim() || !city.trim() || !pincode.trim()) {
            Alert.alert('Incomplete Address', 'Please fill in House No, City, and Pincode.');
            return;
        }

        const fullAddr = `${houseNo}, ${area ? area + ', ' : ''}${city} - ${pincode}`;

        updateLocation({
            address: fullAddr,
            flat: houseNo,
            street: area,
            city,
            postalCode: pincode,
            // coords: ... (we don't have coords for manual unless we geocode, typically okay to leave empty or 0 for now)
            latitude: 0,
            longitude: 0
        });
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setVisible(false)} // Android Back button
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, mode === 'manual' && styles.modalExpanded]}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {mode === 'manual' ? 'Location' : 'Select Location'}
                        </Text>
                        {/* Close button - Only if location is already set roughly? Or allow dismiss? 
                            User: "ensure it disappears... once done its job".
                            We allow close to view app, but maybe banner re-appears. 
                        */}
                        <TouchableOpacity onPress={() => setVisible(false)} hitSlop={10}>
                            <X size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        {/* 1. Grant Access Section (Only in initial mode or auto-detect retry) */}
                        {mode === 'initial' && (
                            <TouchableOpacity
                                style={styles.grantCard}
                                onPress={handleGrantAccess}
                                disabled={loading}
                            >
                                <View style={styles.grantIconBg}>
                                    {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Navigation size={24} color="#FFF" fill="#FFF" />}
                                </View>
                                <View style={styles.grantContent}>
                                    <Text style={styles.grantTitle}>Use Current Location</Text>
                                    <Text style={styles.grantSub}>Enable location for accurate service</Text>
                                </View>
                                <ArrowRight size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        )}

                        {/* 2. Manual Entry Form */}
                        {mode === 'manual' && (
                            <View style={styles.formContainer}>
                                <Text style={styles.sectionHeader}>Address Details</Text>

                                {/* House / Flat No */}
                                <View style={styles.inputRow}>
                                    <Text style={styles.label}>House / Flat No *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. 4B"
                                        value={houseNo}
                                        onChangeText={setHouseNo}
                                    />
                                </View>

                                {/* Area / Street */}
                                <View style={styles.inputRow}>
                                    <Text style={styles.label}>Area / Street</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Gandhi Road, Iyyappanthangal"
                                        value={area}
                                        onChangeText={setArea}
                                    />
                                </View>

                                {/* City */}
                                <View style={styles.inputRow}>
                                    <Text style={styles.label}>City *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Auto-detected"
                                        value={city}
                                        onChangeText={setCity}
                                    />
                                </View>

                                {/* Pincode */}
                                <View style={styles.inputRow}>
                                    <Text style={styles.label}>Pincode *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="000000"
                                        keyboardType="numeric"
                                        value={pincode}
                                        onChangeText={setPincode}
                                        maxLength={6}
                                    />
                                </View>

                                <TouchableOpacity style={styles.confirmButton} onPress={handleManualSubmit}>
                                    <Text style={styles.confirmText}>Confirm Location</Text>
                                </TouchableOpacity>

                                {/* Back to options */}
                                <TouchableOpacity
                                    style={{ marginTop: 12, alignItems: 'center' }}
                                    onPress={() => setMode('initial')}
                                >
                                    <Text style={{ color: COLORS.textLight, fontSize: 12 }}>Change selection method</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* 3. Saved Locations (Only in initial mode) */}
                        {mode === 'initial' && MOCK_SAVED_ADDRESSES.length > 0 && (
                            <View style={styles.savedSection}>
                                <Text style={styles.sectionHeader}>Saved Addresses</Text>
                                {MOCK_SAVED_ADDRESSES.map((addr) => (
                                    <TouchableOpacity
                                        key={addr.id}
                                        style={styles.savedCard}
                                        onPress={() => handleSelectSaved(addr)}
                                    >
                                        <View style={styles.iconCircle}>
                                            {addr.type === 'Home' ? <Home size={16} color={COLORS.text} /> :
                                                addr.type === 'Work' ? <Briefcase size={16} color={COLORS.text} /> :
                                                    <MapPinned size={16} color={COLORS.text} />}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.savedType}>{addr.type}</Text>
                                            <Text style={styles.savedAddr} numberOfLines={1}>{addr.address}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Manual Trigger (Initial Mode) */}
                        {mode === 'initial' && (
                            <TouchableOpacity
                                style={styles.manualLink}
                                onPress={() => setMode('manual')}
                            >
                                <Text style={styles.manualLinkText}>+ Enter Address Manually</Text>
                            </TouchableOpacity>
                        )}

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: THEME.spacing.m,
        minHeight: '45%',
        maxHeight: '90%',
    },
    modalExpanded: {
        minHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    grantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface || '#F5F5F5',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.primary + '30', // Low opacity primary
    },
    grantIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    grantContent: {
        flex: 1,
    },
    grantTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    grantSub: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLight,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    savedSection: {
        marginBottom: 20,
    },
    savedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    savedType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    savedAddr: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    manualLink: {
        alignItems: 'center',
        padding: 12,
    },
    manualLinkText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    formContainer: {
        marginTop: 0,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    inputRow: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 6,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: COLORS.text,
    },
    confirmButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    confirmText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
