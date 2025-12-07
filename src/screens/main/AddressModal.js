import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput, Alert, ScrollView } from 'react-native';
import { MapPin, X, Plus, Home, Briefcase, Navigation } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function AddressModal({ visible, onClose, onSelectLocation, currentAddress }) {
    const [view, setView] = useState('list'); // 'list' or 'add'
    const [savedAddresses, setSavedAddresses] = useState([
        { id: '1', type: 'Home', address: '12-A, Green Park Avenue, Chennai', city: 'Chennai' },
        { id: '2', type: 'Work', address: 'Tech Park, OMR, Chennai', city: 'Chennai' },
    ]);

    // Form State
    const [newType, setNewType] = useState('Home');
    const [newAddress, setNewAddress] = useState('');
    const [newCity, setNewCity] = useState('');

    const handleUseCurrentLocation = () => {
        // Simulate GPS fetch
        const gpsLocation = {
            city: 'Anna Nagar, Chennai',
            address: 'GPS Location: 4th Avenue, Anna Nagar'
        };
        onSelectLocation(gpsLocation);
        onClose();
    };

    const handleSelectAddress = (addr) => {
        onSelectLocation(addr);
        onClose();
    };

    const handleSaveAddress = () => {
        if (!newAddress || !newCity) {
            Alert.alert('Error', 'Please enter address and city');
            return;
        }
        const newAddrObj = {
            id: Date.now().toString(),
            type: newType,
            address: newAddress,
            city: newCity
        };
        setSavedAddresses(prev => [...prev, newAddrObj]);
        setView('list');
        setNewAddress('');
        setNewCity('');
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>
                {view === 'list' ? 'Select Location' : 'Add New Address'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color={COLORS.text} size={24} />
            </TouchableOpacity>
        </View>
    );

    const renderList = () => (
        <>
            <TouchableOpacity style={styles.currentLocationBtn} onPress={handleUseCurrentLocation}>
                <Navigation color={COLORS.primary} size={20} fill={COLORS.primary + '20'} />
                <View style={styles.btnTextContainer}>
                    <Text style={styles.btnTitle}>Use Current Location</Text>
                    <Text style={styles.btnSubtitle}>Using GPS</Text>
                </View>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Saved Addresses</Text>

            <FlatList
                data={savedAddresses}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.addressCard,
                            currentAddress === item.address && styles.activeAddressCard
                        ]}
                        onPress={() => handleSelectAddress(item)}
                    >
                        <View style={styles.addressIcon}>
                            {item.type === 'Home' ? <Home size={20} color={COLORS.text} /> : <Briefcase size={20} color={COLORS.text} />}
                        </View>
                        <View style={styles.addressInfo}>
                            <Text style={styles.addressType}>{item.type}</Text>
                            <Text style={styles.addressText}>{item.address}</Text>
                        </View>
                        {currentAddress === item.address && <MapPin size={16} color={COLORS.primary} />}
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity style={styles.addNewBtn} onPress={() => setView('add')}>
                <Plus color={COLORS.primary} size={20} />
                <Text style={styles.addNewText}>Add New Address</Text>
            </TouchableOpacity>
        </>
    );

    const renderAddForm = () => (
        <ScrollView style={styles.formContainer}>
            <Text style={styles.label}>Label</Text>
            <View style={styles.typeSelector}>
                {['Home', 'Work', 'Other'].map(type => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.typeChip, newType === type && styles.activeTypeChip]}
                        onPress={() => setNewType(type)}
                    >
                        <Text style={[styles.typeText, newType === type && styles.activeTypeText]}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Input
                placeholder="House / Flat / Block No."
                value={newAddress}
                onChangeText={setNewAddress}
                style={styles.input}
            />
            <Input
                placeholder="City / Area"
                value={newCity}
                onChangeText={setNewCity}
                style={styles.input}
            />

            <View style={styles.formActions}>
                <Button title="Save Address" onPress={handleSaveAddress} style={styles.saveBtn} />
                <TouchableOpacity onPress={() => setView('list')} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {renderHeader()}
                    {view === 'list' ? renderList() : renderAddForm()}
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
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '70%',
        padding: THEME.spacing.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.l,
        paddingBottom: THEME.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    closeButton: {
        padding: 4,
    },
    currentLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: THEME.spacing.m,
        backgroundColor: COLORS.primary + '10',
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.l,
    },
    btnTextContainer: {
        marginLeft: THEME.spacing.m,
    },
    btnTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    btnSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: THEME.spacing.m,
        textTransform: 'uppercase',
    },
    listContent: {
        paddingBottom: 80,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeAddressCard: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '05',
    },
    addressIcon: {
        marginRight: THEME.spacing.m,
    },
    addressInfo: {
        flex: 1,
    },
    addressType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    addressText: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    addNewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: THEME.spacing.m,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: THEME.borderRadius.m,
        marginTop: 'auto',
    },
    addNewText: {
        marginLeft: 8,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    // Form Styles
    formContainer: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: COLORS.text,
    },
    typeSelector: {
        flexDirection: 'row',
        marginBottom: THEME.spacing.l,
        gap: 8,
    },
    typeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeTypeChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeText: {
        color: COLORS.text,
        fontWeight: '500',
    },
    activeTypeText: {
        color: COLORS.white,
    },
    input: {
        marginBottom: THEME.spacing.m,
    },
    formActions: {
        marginTop: THEME.spacing.xl,
    },
    saveBtn: {
        marginBottom: THEME.spacing.m,
    },
    cancelBtn: {
        alignItems: 'center',
        padding: 12,
    },
    cancelText: {
        color: COLORS.textLight,
        fontWeight: 'bold',
    },
});
