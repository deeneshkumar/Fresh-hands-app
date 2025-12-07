import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, CreditCard, Wallet, Banknote, Navigation } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';

export default function BookingScreen({ route, navigation }) {
    const { service } = route.params;
    const { user } = useAuth();

    const [date, setDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [time, setTime] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [address, setAddress] = useState(user?.city || '');
    const [addressError, setAddressError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null);

    // Cost Calculations
    const itemTotal = Number(service.price);
    const convenienceFee = 49;
    const taxes = Math.round(itemTotal * 0.18);
    const grandTotal = itemTotal + convenienceFee + taxes;

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    const handleUseCurrentLocation = () => {
        // In a real app, use expo-location here
        if (user?.city) {
            setAddress(user.city);
        } else {
            Alert.alert('Location', 'Fetching current location... (Mock: Chennai, India)');
            setAddress('Chennai, India');
        }
    };

    const PaymentOption = ({ id, icon: Icon, label }) => (
        <TouchableOpacity
            style={[
                styles.paymentOption,
                paymentMethod === id && styles.paymentOptionActive
            ]}
            onPress={() => setPaymentMethod(id)}
        >
            <Icon color={paymentMethod === id ? COLORS.primary : COLORS.textLight} size={24} />
            <Text style={[
                styles.paymentLabel,
                paymentMethod === id && styles.paymentLabelActive
            ]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Book Service</Text>

                <View style={styles.serviceSummary}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.servicePrice}>₹{service.price}</Text>
                </View>

                <Text style={styles.sectionTitle}>Select Date & Time <Text style={{ color: COLORS.error }}>*</Text></Text>

                <View style={styles.pickerRow}>
                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
                        <Calendar color={date ? COLORS.primary : COLORS.textLight} size={20} />
                        <Text style={[styles.pickerText, !date && styles.placeholderText]}>
                            {date ? date.toDateString() : 'Select Date *'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
                        <Clock color={time ? COLORS.primary : COLORS.textLight} size={20} />
                        <Text style={[styles.pickerText, !time && styles.placeholderText]}>
                            {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Choose Time *'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={time || new Date()}
                        mode="time"
                        display="default"
                        onChange={onTimeChange}
                    />
                )}

                <Text style={styles.sectionTitle}>Service Address <Text style={{ color: COLORS.error }}>*</Text></Text>
                <View style={styles.addressContainer}>
                    <Input
                        placeholder="Enter full address *"
                        value={address}
                        onChangeText={(text) => {
                            setAddress(text);
                            if (text.trim()) setAddressError('');
                        }}
                        style={styles.addressInput}
                        error={addressError}
                    />
                    <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
                        <Navigation color={COLORS.white} size={20} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Payment Method <Text style={{ color: COLORS.error }}>*</Text></Text>
                <View style={styles.paymentContainer}>
                    <PaymentOption id="card" icon={CreditCard} label="Card" />
                    <PaymentOption id="upi" icon={Wallet} label="UPI" />
                    <PaymentOption id="cash" icon={Banknote} label="Cash" />
                </View>

                {/* Bill Details */}
                <View style={styles.billContainer}>
                    <Text style={styles.billTitle}>Bill Details</Text>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Item Total</Text>
                        <Text style={styles.billValue}>₹{itemTotal}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Convenience Fee</Text>
                        <Text style={styles.billValue}>₹{convenienceFee}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Taxes (18%)</Text>
                        <Text style={styles.billValue}>₹{taxes}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.billRowTotal}>
                        <Text style={styles.totalLabel}>To Pay</Text>
                        <Text style={styles.totalAmount}>₹{grandTotal}</Text>
                    </View>
                </View>

                <Button
                    title="Proceed to Pay"
                    onPress={() => {
                        let isValid = true;

                        // Validate Date
                        if (!date) {
                            Alert.alert('Missing Details', 'Please select a date for the service.');
                            isValid = false;
                        }
                        // Validate Time
                        else if (!time) {
                            Alert.alert('Missing Details', 'Please choose a time for the service.');
                            isValid = false;
                        }
                        // Validate Address
                        else if (!address.trim()) {
                            setAddressError('Service address is required');
                            Alert.alert('Missing Details', 'Please provide a valid service address.');
                            isValid = false;
                        }
                        // Validate Payment
                        else if (!paymentMethod) {
                            Alert.alert('Missing Details', 'Please select a payment method.');
                            isValid = false;
                        }

                        if (!isValid) return;

                        navigation.navigate('Payment', {
                            orderDetails: {
                                service,
                                date: date.toDateString(),
                                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                address: address.trim(),
                                paymentMethod,
                                billDetails: {
                                    itemTotal,
                                    convenienceFee,
                                    taxes,
                                    grandTotal
                                }
                            }
                        });
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: THEME.spacing.m,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.l,
        color: COLORS.text,
    },
    serviceSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.l,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    servicePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.m,
        marginTop: THEME.spacing.s,
        color: COLORS.text,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.l,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        flex: 0.48,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    pickerText: {
        marginLeft: 8,
        color: COLORS.text,
        fontWeight: '500',
    },
    placeholderText: {
        color: COLORS.textLight,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.l,
    },
    addressInput: {
        flex: 1,
        marginRight: 8,
    },
    locationButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: THEME.borderRadius.m,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50, // Match input height approx
        width: 50,
    },
    paymentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.l,
    },
    paymentOption: {
        flex: 1,
        alignItems: 'center',
        padding: THEME.spacing.m,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: THEME.borderRadius.m,
        marginHorizontal: 4,
        backgroundColor: COLORS.surface,
    },
    paymentOptionActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFF3E0',
    },
    paymentLabel: {
        marginTop: 8,
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    paymentLabelActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    billContainer: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.l,
    },
    billTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.m,
        color: COLORS.text,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    billLabel: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    billValue: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 8,
    },
    billRowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});
