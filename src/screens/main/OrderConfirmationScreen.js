import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Platform, Dimensions, TouchableOpacity, LayoutAnimation, UIManager, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MessageSquare, Star, ArrowLeft, CheckCircle } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import { useOrder } from '../../context/OrderContext';

const { width, height } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

// Custom Map Style (Same as Booking)
const MAP_STYLE = [
    { "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "weight": "2.00" }] },
    { "featureType": "all", "elementType": "geometry.stroke", "stylers": [{ "color": "#9c9c9c" }] },
    { "featureType": "all", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] },
    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
    { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "on" }] },
    { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
    { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }
];

export default function OrderConfirmationScreen({ navigation, route }) {
    const { createOrder, updateActiveOrder, completeActiveOrder } = useOrder();
    const mapRef = useRef(null);
    const timeouts = useRef([]);
    const intervalRef = useRef(null);

    // Params
    const orderDetails = route.params?.orderDetails || {};
    const serviceName = route.params?.service?.name || 'Service';
    // Default to a fallback location if missing (New Delhi center)
    const userLocation = orderDetails.coordinates || { latitude: 28.6139, longitude: 77.2090 };

    // State
    const [partnerLocation, setPartnerLocation] = useState(null);
    const [status, setStatus] = useState(orderDetails.status === 'Completed' ? 'arrived' : (orderDetails.status || 'searching'));
    const [eta, setEta] = useState(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    useEffect(() => {
        if (orderDetails?.status === 'Completed') return; // Skip simulation for completed orders

        if (orderDetails) {
            createOrder(orderDetails);
        }

        // 1. Initialize Partner Location (Random offset 2-3km away)
        const randomLatOffset = (Math.random() * 0.02) - 0.01;
        const randomLngOffset = (Math.random() * 0.02) - 0.01;
        const startLat = userLocation.latitude + randomLatOffset;
        const startLng = userLocation.longitude + randomLngOffset;

        const startPos = { latitude: startLat, longitude: startLng };
        setPartnerLocation(startPos);

        // Sync initial location
        if (updateActiveOrder) {
            updateActiveOrder({
                partnerLocation: startPos,
                status: 'Searching for partner...',
                eta: 'Calculating...'
            });
        }

        // 3-Minute Simulation Logic

        // Helper to push timeout
        const addTimeout = (cb, ms) => {
            const id = setTimeout(cb, ms);
            timeouts.current.push(id);
            return id;
        };

        // 1. Assigned (5s)
        addTimeout(() => {
            if (status === 'searching') {
                setStatus('assigned');
                if (updateActiveOrder) updateActiveOrder({ status: 'Partner Assigned', eta: '15 mins' });
            }
        }, 5000);

        // 2. Start Moving (Arriving) after assigned
        addTimeout(() => {
            if (status !== 'arrived' && status !== 'work_in_progress') {
                setStatus('arriving');
                if (updateActiveOrder) updateActiveOrder({ status: 'Partner Heading to Location', eta: '5 mins' });

                // Move partner - Duration 55s (from 5s to 60s)
                let steps = 0;
                const totalSteps = 110;

                intervalRef.current = setInterval(() => {
                    steps++;
                    const t = steps / totalSteps;

                    if (t > 1) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        // 3. Arrived at ~60s
                        setStatus('arrived');
                        if (updateActiveOrder) updateActiveOrder({ status: 'Partner Arrived', eta: 'Arrived, Please meet partner.' });

                        // 4. Start Work after brief pause (at 65s)
                        addTimeout(() => {
                            setStatus('work_in_progress');
                            if (updateActiveOrder) updateActiveOrder({ status: 'Work in Progress', eta: 'Service in Progress...' });

                            // 5. Complete after work duration (175s total time ~ 3 mins)
                            addTimeout(() => {
                                setStatus('completed');
                                // Call context to move to history
                                if (completeActiveOrder) {
                                    completeActiveOrder();
                                    Alert.alert("Service Completed", "Job Done! Your order has been moved to history.", [
                                        { text: "View History", onPress: () => navigation.navigate('Orders') },
                                        { text: "Home", onPress: () => navigation.navigate('Main') }
                                    ]);
                                }
                            }, 110000); // 110 seconds work duration

                        }, 5000);

                        return;
                    }

                    const newLat = startLat + (userLocation.latitude - startLat) * t;
                    const newLng = startLng + (userLocation.longitude - startLng) * t;

                    setPartnerLocation({ latitude: newLat, longitude: newLng });

                    const remainingMinutes = Math.ceil((1 - t) * 5);
                    const newEta = `${remainingMinutes} mins`;
                    setEta(newEta);

                    if (updateActiveOrder) {
                        updateActiveOrder({
                            eta: newEta,
                            partner: orderDetails.partner || { name: 'Rajesh Kumar', rating: 4.8 },
                            partnerLocation: { latitude: newLat, longitude: newLng }
                        });
                    }

                }, 500);
            }
        }, 6000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            timeouts.current.forEach(clearTimeout);
        };
    }, []);

    // Fit map to markers when partner is assigned
    useEffect(() => {
        if (partnerLocation && mapRef.current) {
            mapRef.current.fitToCoordinates([userLocation, partnerLocation], {
                edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
                animated: true,
            });
        }
    }, [partnerLocation]);


    return (
        <View style={styles.container}>
            {/* Map Background */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={MAP_STYLE}
                initialRegion={{
                    ...userLocation,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={userLocation} title="Your Location">
                    <View style={styles.userMarker}>
                        <View style={styles.userMarkerDot} />
                    </View>
                </Marker>

                {partnerLocation && (
                    <Marker coordinate={partnerLocation} title="Partner">
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png' }}
                            style={styles.partnerIcon}
                        />
                    </Marker>
                )}

                {partnerLocation && (
                    <Polyline
                        coordinates={[partnerLocation, userLocation]}
                        strokeColor={COLORS.primary}
                        strokeWidth={3}
                        lineDashPattern={[1]}
                    />
                )}
            </MapView>

            {/* Top Bar */}
            <SafeAreaView style={styles.topContainer} pointerEvents="box-none">
                <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Bottom Sheet UI */}
            <View style={styles.bottomSheet}>
                {/* Fixed Header Section (Handle + Status) */}
                <View style={{ backgroundColor: 'transparent' }}>
                    <View style={styles.handleContainer}>
                        <View style={styles.dragHandle} />
                        <Text style={styles.expandText}>Order Details</Text>
                    </View>

                    {/* Status Header (Always visible and part of drag area) */}
                    {status !== 'searching' && (
                        <View style={styles.statusHeaderRow}>
                            <View>
                                <Text style={styles.statusTitle}>
                                    {status === 'arrived' ? 'Partner Arrived!' : status === 'work_in_progress' ? 'Work in Progress' : 'Partner is on the way'}
                                </Text>
                                <Text style={styles.statusSub}>
                                    {status === 'arrived' ? 'Please meet them securely.' : status === 'work_in_progress' ? 'Service is being performed.' : `Arriving in ${eta || 'Calculating...'}`}
                                </Text>
                            </View>
                            {status === 'arriving' && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>On Time</Text>
                                </View>
                            )}
                            {status === 'work_in_progress' && (
                                <View style={[styles.badge, { backgroundColor: '#E3F2FD' }]}>
                                    <Text style={[styles.badgeText, { color: '#2196F3' }]}>Active</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {status === 'searching' && (
                    <View style={styles.statusBox}>
                        <Text style={styles.statusTitle}>Finding a Partner...</Text>
                        <Text style={styles.statusSub}>Available partners nearby are being notified.</Text>
                    </View>
                )}

                {status !== 'searching' && (
                    <View style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                            {/* Collapsible Content (Partner Card + details) */}

                            {/* Partner Profile */}
                            <View style={styles.partnerCard}>
                                <Image
                                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                    style={styles.partnerAvatar}
                                />
                                <View style={styles.partnerInfo}>
                                    <Text style={styles.partnerName}>Rajesh Kumar</Text>
                                    <View style={styles.ratingRow}>
                                        <Star size={14} color="#FFD700" fill="#FFD700" />
                                        <Text style={styles.ratingText}>4.8</Text>
                                    </View>
                                    <Text style={styles.partnerJob}>Professional Cleaner</Text>
                                </View>

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity style={styles.iconBtn}>
                                        <Phone size={20} color={COLORS.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconBtn}>
                                        <MessageSquare size={20} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Order Code */}
                            <View style={styles.codeRow}>
                                <Text style={styles.codeLabel}>OTP for Service:</Text>
                                <Text style={styles.codeValue}>4921</Text>
                            </View>

                            {/* Order Summary */}
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryTitle}>Order Summary</Text>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Service</Text>
                                    <Text style={styles.summaryValue}>{serviceName}</Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Date & Time</Text>
                                    <Text style={styles.summaryValue}>
                                        {orderDetails.date || 'Today'} at {orderDetails.time || 'Now'}
                                    </Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Address</Text>
                                    <Text style={styles.summaryValue} numberOfLines={3}>
                                        {orderDetails.address}
                                    </Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Payment</Text>
                                    <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                                        {orderDetails.paymentMethod?.toUpperCase()}
                                    </Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={[styles.summaryRow, { marginTop: 4 }]}>
                                    <Text style={[styles.summaryLabel, styles.totalLabel]}>Total</Text>
                                    <Text style={[styles.summaryValue, styles.totalValue]}>
                                        ₹{orderDetails.billDetails?.grandTotal}
                                    </Text>
                                </View>
                            </View>

                            <Button
                                title="Go to Home"
                                variant="outline"
                                onPress={() => navigation.navigate('Main')}
                                style={{ marginTop: 20 }}
                            />
                        </ScrollView>
                    </View>
                )}

            </View>

            {/* Completion Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showCompletionModal}
                onRequestClose={() => { }} // Clean exit only via buttons
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconContainer}>
                            <CheckCircle size={64} color={COLORS.success} />
                        </View>
                        <Text style={styles.modalTitle}>Service Completed!</Text>
                        <Text style={styles.modalText}>
                            Job Done! Your order has been moved to history.
                        </Text>

                        <View style={styles.modalButtons}>
                            <Button
                                title="View History"
                                variant="outline"
                                onPress={() => {
                                    setShowCompletionModal(false);
                                    navigation.navigate('Orders');
                                }}
                                style={{ marginBottom: 16 }}
                            />
                            <Button
                                title="Back to Home"
                                onPress={() => {
                                    setShowCompletionModal(false);
                                    navigation.navigate('Main');
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    map: {
        flex: 1,
    },
    topContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: THEME.spacing.m,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    userMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 150, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    userMarkerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    partnerIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: THEME.spacing.l,
        paddingTop: THEME.spacing.m,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        height: height * 0.5, // Fixed 50% height
    },
    // bottomSheetCollapsed removed
    handleContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: COLORS.white,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginBottom: 4,
    },
    expandText: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: 'bold',
    },
    statusBox: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    statusSub: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    statusHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
        paddingHorizontal: 4, // Add padding horizontal since it's now outside scrollview inside padded container? 
        // Actually parent has padding, so this is fine.
    },
    badge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        color: COLORS.success,
        fontWeight: 'bold',
    },
    partnerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    partnerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    partnerInfo: {
        flex: 1,
    },
    partnerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    ratingText: {
        fontSize: 12,
        color: COLORS.text,
        marginLeft: 4,
        fontWeight: '500',
    },
    partnerJob: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    codeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        marginBottom: 4,
    },
    codeLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    codeValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 2,
    },
    summaryCard: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        flex: 1,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1.5,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 8,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: THEME.spacing.l,
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: THEME.spacing.xl,
        width: '100%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalIconContainer: {
        marginBottom: THEME.spacing.l,
        backgroundColor: '#E8F5E9',
        padding: 20,
        borderRadius: 50,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.s,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: THEME.spacing.xl,
        lineHeight: 22,
    },
    modalButtons: {
        width: '100%',
    },
});
