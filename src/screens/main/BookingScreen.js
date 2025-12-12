import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, CreditCard, Wallet, Banknote, Navigation, Zap, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import AddressModal from './AddressModal';

export default function BookingScreen({ route, navigation }) {
    const { service } = route.params;
    const { user, location } = useAuth(); // Use global location if available

    // Booking Type: 'instant' or 'schedule'
    const [bookingType, setBookingType] = useState(null); // No default selection

    // Schedule State
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Address State
    const [address, setAddress] = useState(location?.address || user?.city || '');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressError, setAddressError] = useState('');

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState(null);

    // Generate Next 3 Days
    const getNext3Days = () => {
        const days = [];
        for (let i = 0; i < 3; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            days.push({
                fullDate: d,
                dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
                dateString: d.getDate()
            });
        }
        return days;
    };
    const next3Days = getNext3Days();

    // Generate Time Slots (e.g., 9 AM to 8 PM)
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
        '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    // Cost Calculations
    const itemTotal = Number(service.price);
    const convenienceFee = 49;
    const taxes = Math.round(itemTotal * 0.18);
    const grandTotal = itemTotal + convenienceFee + taxes;

    // Handle Address Selection from Modal
    const handleSelectLocation = (loc) => {
        setAddress(loc.address);
        setAddressError('');
    };

    const handleUseCurrentLocation = () => {
        // Mock location fetch
        Alert.alert('Location', 'Fetching current location...');
        setTimeout(() => {
            setAddress('123, Gandhi Road, Chennai, Tamil Nadu');
            setAddressError('');
        }, 1000);
    };

    const proceedToPay = () => {
        let finalDate, finalTime;

        // Validation: Booking Type
        if (!bookingType) {
            Alert.alert('Booking Type', 'Please select when you need the service (Instant or Schedule).');
            return;
        }

        if (!address.trim()) {
            setAddressError('Address is required');
            Alert.alert('Missing Details', 'Please provide a service address.');
            return;
        }

        if (bookingType === 'instant') {
            const now = new Date();
            now.setHours(now.getHours() + 1); // Arrival in 1 hr
            finalDate = new Date().toDateString();
            finalTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            if (!selectedTimeSlot) {
                Alert.alert('Select Time', 'Please select a time slot for your scheduled booking.');
                return;
            }
            finalDate = next3Days[selectedDateIndex].fullDate.toDateString();
            finalTime = selectedTimeSlot;
        }

        if (!paymentMethod) {
            Alert.alert('Payment Method', 'Please select a payment method.');
            return;
        }

        navigation.navigate('Payment', {
            orderDetails: {
                service,
                date: finalDate,
                time: finalTime,
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
    };

    const PaymentCard = ({ id, icon: Icon, title, subtitle, disabled = false }) => (
        <TouchableOpacity
            style={[
                styles.paymentCard,
                paymentMethod === id && styles.paymentCardActive,
                disabled && styles.paymentCardDisabled
            ]}
            onPress={() => {
                if (!disabled) setPaymentMethod(id);
                else Alert.alert('Low Balance', 'You do not have enough funds in your wallet. Please add money.');
            }}
            activeOpacity={disabled ? 1 : 0.9}
        >
            <View style={styles.paymentCardLeft}>
                <View style={[
                    styles.paymentIconBox,
                    paymentMethod === id && styles.paymentIconBoxActive,
                    disabled && styles.paymentIconBoxDisabled
                ]}>
                    <Icon color={disabled ? COLORS.textLight : (paymentMethod === id ? COLORS.white : COLORS.primary)} size={24} />
                </View>
                <View style={styles.paymentInfo}>
                    <Text style={[styles.paymentTitle, disabled && styles.textDisabled]}>{title}</Text>
                    <Text style={[
                        styles.paymentSubtitle,
                        disabled && { color: COLORS.error }
                    ]}>
                        {disabled ? 'Insufficient Balance' : subtitle}
                    </Text>
                </View>
            </View>
            <View style={[styles.paymentRadio, disabled && { opacity: 0.5 }]}>
                {paymentMethod === id ? (
                    <CheckCircle2 color={COLORS.primary} size={24} fill={COLORS.white} />
                ) : (
                    <View style={styles.radioUnchecked} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm Booking</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Service Info */}
                <View style={styles.serviceSummary}>
                    <View>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceCategory}>Expert Service</Text>
                    </View>
                    <Text style={styles.servicePrice}>₹{service.price}</Text>
                </View>

                {/* Booking Type Selection */}
                <Text style={styles.sectionTitle}>When do you need it? <Text style={{ color: COLORS.error }}>*</Text></Text>
                <View style={styles.bookingTypeContainer}>
                    <TouchableOpacity
                        style={[styles.typeCard, bookingType === 'instant' && styles.typeCardActive]}
                        onPress={() => setBookingType('instant')}
                    >
                        <Zap color={bookingType === 'instant' ? COLORS.white : COLORS.warning} size={24} fill={bookingType === 'instant' ? COLORS.white : 'transparent'} />
                        <Text style={[styles.typeTitle, bookingType === 'instant' && styles.textWhite]}>Instant</Text>
                        <Text style={[styles.typeSubtitle, bookingType === 'instant' && styles.textWhite]}>Agent arrives within 1 hr</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.typeCard, bookingType === 'schedule' && styles.typeCardActive]}
                        onPress={() => setBookingType('schedule')}
                    >
                        <Calendar color={bookingType === 'schedule' ? COLORS.white : COLORS.primary} size={24} />
                        <Text style={[styles.typeTitle, bookingType === 'schedule' && styles.textWhite]}>Schedule</Text>
                        <Text style={[styles.typeSubtitle, bookingType === 'schedule' && styles.textWhite]}>Book for later</Text>
                    </TouchableOpacity>
                </View>

                {/* Show Schedule Picker if 'schedule' is selected */}
                {bookingType === 'schedule' && (
                    <View style={styles.scheduleContainer}>
                        {/* Date Slots */}
                        <Text style={styles.subLabel}>Select Date</Text>
                        <View style={styles.datesRow}>
                            {next3Days.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.dateChip, selectedDateIndex === index && styles.dateChipActive]}
                                    onPress={() => setSelectedDateIndex(index)}
                                >
                                    <Text style={[styles.dayName, selectedDateIndex === index && styles.textWhite]}>{item.dayName}</Text>
                                    <Text style={[styles.dateNum, selectedDateIndex === index && styles.textWhite]}>{item.dateString}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Time Slots */}
                        <Text style={styles.subLabel}>Select Time</Text>
                        <View style={styles.timeGrid}>
                            {timeSlots.map((slot, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.timeChip, selectedTimeSlot === slot && styles.timeChipActive]}
                                    onPress={() => setSelectedTimeSlot(slot)}
                                >
                                    <Text style={[styles.timeText, selectedTimeSlot === slot && styles.textWhite]}>{slot}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Address Section */}
                <Text style={styles.sectionTitle}>Service Location</Text>
                <View style={styles.addressBox}>
                    <Input
                        placeholder="Enter Address / Flat No *"
                        value={address}
                        onChangeText={(text) => {
                            setAddress(text);
                            if (text) setAddressError('');
                        }}
                        containerStyle={{ marginBottom: 8 }}
                        error={addressError}
                    />
                    <View style={styles.locationActions}>
                        <TouchableOpacity style={styles.currentLocationBtn} onPress={handleUseCurrentLocation}>
                            <Navigation color={COLORS.primary} size={16} />
                            <Text style={styles.currentLocationText}>Use Current Location</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                            <Text style={styles.savedAddressLink}>+ Select from Saved Addresses</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Payment Section */}
                <View style={styles.paymentContainer}>
                    <PaymentCard
                        id="wallet"
                        icon={Wallet}
                        title="Fresh Hands Wallet"
                        subtitle={`Balance: ₹${(user?.walletBalance || 0).toFixed(2)}`}
                        disabled={(user?.walletBalance || 0) < grandTotal}
                    />
                    <PaymentCard
                        id="upi"
                        icon={Wallet}
                        title="UPI Payment"
                        subtitle="Google Pay, PhonePe, Paytm"
                    />
                    <PaymentCard
                        id="card"
                        icon={CreditCard}
                        title="Credit / Debit Card"
                        subtitle="Visa, Mastercard, Rupay"
                    />
                    <PaymentCard
                        id="cash"
                        icon={Banknote}
                        title="Cash on Delivery"
                        subtitle="Pay after service"
                    />
                </View>

                {/* Bill Details */}
                <View style={styles.billCard}>
                    <Text style={styles.billHeader}>Bill Details</Text>
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
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total</Text>
                        <Text style={styles.totalValue}>₹{grandTotal}</Text>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerTotalLabel}>To Pay</Text>
                    <Text style={styles.footerTotalValue}>₹{grandTotal}</Text>
                </View>
                <Button
                    title="Place Booking"
                    onPress={proceedToPay}
                    style={{ width: '60%' }}
                />
            </View>

            <AddressModal
                visible={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSelectLocation={handleSelectLocation}
            />
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
        padding: THEME.spacing.m,
        backgroundColor: COLORS.white,
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
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: THEME.spacing.m,
        paddingBottom: 100, // Space for footer
    },
    serviceSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.l,
        elevation: 1,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    serviceCategory: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
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
        color: COLORS.text,
    },
    bookingTypeContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: THEME.spacing.l,
    },
    typeCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    typeCardActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        color: COLORS.text,
    },
    typeSubtitle: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 4,
        textAlign: 'center',
    },
    textWhite: {
        color: COLORS.white,
    },
    scheduleContainer: {
        backgroundColor: COLORS.white,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.l,
    },
    subLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: COLORS.text,
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dateChip: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    dateChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    dayName: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 2,
    },
    dateNum: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    timeChip: {
        width: '30%',
        paddingVertical: 8,
        backgroundColor: COLORS.background,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    timeChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: '500',
    },
    addressBox: {
        marginBottom: THEME.spacing.l,
    },
    locationActions: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 4,
    },
    currentLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 4,
    },
    currentLocationText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    savedAddressLink: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
        padding: 4,
    },
    paymentContainer: {
        gap: 12,
        marginBottom: THEME.spacing.l,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    paymentCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#F0F9FF',
    },
    paymentCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    paymentIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentIconBoxActive: {
        backgroundColor: COLORS.primary,
    },
    paymentInfo: {

    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    paymentSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    paymentRadio: {

    },
    radioUnchecked: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    billCard: {
        backgroundColor: COLORS.white,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        elevation: 1,
    },
    billHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: COLORS.text,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    billLabel: {
        color: COLORS.textLight,
    },
    billValue: {
        color: COLORS.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: THEME.spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    footerTotalLabel: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    footerTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    paymentCardDisabled: {
        backgroundColor: '#EEEEEE',
        borderColor: COLORS.border,
        opacity: 0.7,
    },
    paymentIconBoxDisabled: {
        backgroundColor: '#DDDDDD',
    },
    textDisabled: {
        color: COLORS.textLight,
    },
});
