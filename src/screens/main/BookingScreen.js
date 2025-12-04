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

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [address, setAddress] = useState(user?.city || '');
    const [paymentMethod, setPaymentMethod] = useState('cash');

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

    const handleConfirm = () => {
        if (!address) {
            Alert.alert('Missing Details', 'Please provide a service address.');
            return;
        }
        navigation.navigate('OrderConfirmation', {
            service,
            date: date.toDateString(),
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            address,
            paymentMethod
        });
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

                <Text style={styles.sectionTitle}>Select Date & Time</Text>

                <View style={styles.pickerRow}>
                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
                        <Calendar color={COLORS.primary} size={20} />
                        <Text style={styles.pickerText}>{date.toDateString()}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
                        <Clock color={COLORS.primary} size={20} />
                        <Text style={styles.pickerText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={onTimeChange}
                    />
                )}

                <Text style={styles.sectionTitle}>Service Address</Text>
                <View style={styles.addressContainer}>
                    <Input
                        placeholder="Enter full address"
                        value={address}
                        onChangeText={setAddress}
                        style={styles.addressInput}
                    />
                    <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
                        <Navigation color={COLORS.white} size={20} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.paymentContainer}>
                    <PaymentOption id="card" icon={CreditCard} label="Card" />
                    <PaymentOption id="upi" icon={Wallet} label="UPI" />
                    <PaymentOption id="cash" icon={Banknote} label="Cash" />
                </View>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>₹{service.price}</Text>
                </View>

                <Button title="Confirm Booking" onPress={handleConfirm} />
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
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: THEME.spacing.l,
        paddingTop: THEME.spacing.m,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});
