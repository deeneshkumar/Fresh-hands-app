import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, User, ChevronDown, Star, Clock, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { POPULAR_SERVICES, SERVICES, CATEGORIES } from '../../constants/dummyData';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import Banner from '../../components/Banner';
import ServiceCard from '../../components/ServiceCard';
import Footer from '../../components/Footer';
import OrderDetailsModal from './OrderDetailsModal';

import AddressModal from './AddressModal';

export default function HomeScreen({ navigation }) {
    const { user, location, updateLocation } = useAuth(); // Use location from context
    const { activeOrder } = useOrder();
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const handleSelectLocation = (loc) => {
        updateLocation(loc); // Update global context
    };

    const renderServiceCard = (service) => (
        <ServiceCard
            key={service.id}
            service={service}
            horizontal={true}
            onPress={() => navigation.navigate('ServiceDetail', { service })}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Background Theme - Soft, unique cream gradient */}
                <LinearGradient
                    colors={['#edc4adff', '#FFFFFF']} // Soft Cream to White
                    style={styles.backgroundTheme}
                />

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.logoButton} onPress={() => navigation.openDrawer && navigation.openDrawer()}>
                            <View style={styles.logoIcon}>
                                <Text style={styles.logoText}>FH</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.locationWrapper}>
                            <Text style={styles.locationLabel}>Current Location</Text>
                            <TouchableOpacity
                                style={styles.locationContainer}
                                onPress={() => setShowAddressModal(true)}
                                activeOpacity={0.8}
                            >
                                <MapPin color={COLORS.primary} size={16} />
                                <View style={styles.addressBox}>
                                    <Text
                                        style={styles.locationText}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        adjustsFontSizeToFit={true}
                                        minimumFontScale={0.8}
                                    >
                                        {location?.address || user?.city ? (location?.address || `${user.city}, India`) : 'Select Location'}
                                    </Text>
                                </View>
                                <ChevronDown color={COLORS.text} size={16} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                        <User color={COLORS.primary} size={24} />
                    </TouchableOpacity>
                </View>

                {/* Hero Content */}
                <View style={[styles.heroContainer, { paddingHorizontal: THEME.spacing.m }]}>
                    <Text style={styles.heroTitle}>Welcome back, {user?.name?.split(' ')[0] || 'Guest'}!</Text>
                    <View style={styles.taglineContainer}>
                        <Text style={styles.taglineText}>Expertise you can trust, right at your doorstep.</Text>
                    </View>
                </View>

                {/* Slogan 1 */}
                <View style={[styles.sloganContainer, { marginBottom: 2 }]}>
                    <Sparkles color={COLORS.secondary} size={16} style={{ marginRight: 8 }} />
                    <Text style={styles.sloganText}>Unbeatable Offers, Just for You! ✨</Text>
                </View>

                {/* Banner */}
                <Banner containerStyle={{ marginHorizontal: THEME.spacing.m, marginBottom: 8 }} />

                {/* Slogan 2 */}
                <View style={[styles.sloganContainer, { marginBottom: 10, marginTop: 0, paddingTop: 4 }]}>
                    <Text style={[styles.sloganTextSecondary, { textAlign: 'center', marginHorizontal: 20 }]}>Browse Our Top-Rated Categories</Text>
                </View>

                {/* Categories - 2 Rows Horizontal Scroll */}
                <View style={[styles.sectionHeader, { paddingHorizontal: THEME.spacing.m }]}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={{ paddingHorizontal: THEME.spacing.m }}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.categoryCard}
                            onPress={() => navigation.navigate('Fresh Hands', { categoryId: cat.id })}
                            activeOpacity={0.9}
                        >
                            <View style={styles.categoryIconContainer}>
                                {cat.image ? (
                                    <Image source={{ uri: cat.image }} style={styles.categoryImage} resizeMode="cover" />
                                ) : (
                                    <Text style={styles.categoryIconText}>{cat.name[0]}</Text>
                                )}
                            </View>
                            <View style={styles.categoryInfo}>
                                <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                                <Text style={styles.categoryTagline} numberOfLines={1}>{cat.tagline}</Text>
                                <Text style={styles.categoryPricing} numberOfLines={1}>{cat.pricing}</Text>
                                <View style={styles.categoryStats}>
                                    <View style={styles.statRow}>
                                        <Star size={10} color={COLORS.warning} fill={COLORS.warning} />
                                        <Text style={styles.statText}>{cat.rating} ({cat.reviewCount})</Text>
                                    </View>
                                    <View style={styles.statRow}>
                                        <Clock size={10} color={COLORS.textLight} />
                                        <Text style={styles.statText}>{cat.arrivalTime}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>



                {/* Popular Services */}
                <View style={[styles.sectionHeader, { paddingHorizontal: THEME.spacing.m }]}>
                    <Text style={styles.sectionTitle}>Popular Services</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Fresh Hands')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularList} contentContainerStyle={{ paddingHorizontal: THEME.spacing.m }}>
                    {POPULAR_SERVICES.map(renderServiceCard)}
                </ScrollView>

                {/* Pagination Dots */}
                <View style={styles.paginationDots}>
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>

                {/* Footer Branding */}
                <View style={{ paddingHorizontal: THEME.spacing.m }}>
                    <Footer />
                </View>
            </ScrollView >

            <AddressModal
                visible={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSelectLocation={handleSelectLocation}
                currentAddress={location?.address}
            />

            {/* Live Order Card */}
            {
                activeOrder && (
                    <TouchableOpacity
                        style={styles.liveOrderCard}
                        onPress={() => setShowOrderModal(true)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.liveOrderInfo}>
                            <Text style={styles.liveOrderTitle}>Ongoing Service</Text>
                            <Text style={styles.liveOrderStatus}>{activeOrder.status} • {activeOrder.eta}</Text>
                        </View>
                        <View style={styles.liveOrderBadge}>
                            <Text style={styles.liveOrderBadgeText}>Track</Text>
                        </View>
                    </TouchableOpacity>
                )
            }

            <OrderDetailsModal
                visible={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                order={activeOrder}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    backgroundTheme: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    content: {
        // padding: THEME.spacing.m, // Removed padding from whole content
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.m,
        paddingVertical: THEME.spacing.s,
        backgroundColor: COLORS.white, // Clean White Header
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        elevation: 0, // Minimal
        zIndex: 100,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Allow taking up space
        marginRight: THEME.spacing.m,
    },
    logoButton: {
        marginRight: THEME.spacing.m,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    logoIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    locationWrapper: {
        justifyContent: 'center',
        flex: 1,
        marginLeft: 8,
    },
    locationLabel: {
        fontSize: 10,
        color: COLORS.textLight, // Grey text
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        alignSelf: 'flex-start',
        maxWidth: '100%',
    },
    addressBox: {
        flex: 1,
        marginHorizontal: 4,
    },
    locationText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: COLORS.text, // Black text
    },
    profileButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: COLORS.background, // Light grey circle
    },
    heroContainer: {
        marginBottom: THEME.spacing.s, // Reduced from l to s for tighter spacing
        marginTop: THEME.spacing.m,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text, // Black text
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 16,
        color: COLORS.textLight, // Grey text
        marginBottom: 12,
    },
    taglineContainer: {
        backgroundColor: COLORS.primary + '15', // Subtle primary tint
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    taglineText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary, // Primary text
        fontStyle: 'italic',
    },
    sloganContainer: {
        marginBottom: THEME.spacing.m,
        paddingTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sloganText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        fontStyle: 'italic',
    },
    sloganTextSecondary: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLight,
        letterSpacing: 0.5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.m,
        marginTop: THEME.spacing.s,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    seeAll: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    popularList: {
        marginBottom: THEME.spacing.s,
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: THEME.spacing.l,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.border,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 20,
    },
    categoriesScroll: {
        marginBottom: THEME.spacing.l,
    },
    categoryCard: {
        width: 160,
        height: 200,
        marginRight: THEME.spacing.m,
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    categoryIconContainer: {
        height: 100, // Reduced from 100
        width: '100%',
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryIconText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    categoryInfo: {
        padding: THEME.spacing.s,
        flex: 1,
        justifyContent: 'space-between',
    },
    categoryName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    categoryTagline: {
        fontSize: 10,
        color: COLORS.textLight,
        marginBottom: 2,
    },
    categoryPricing: {
        fontSize: 10,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    categoryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    statText: {
        fontSize: 9,
        color: COLORS.textLight,
        marginLeft: 2,
    },
    liveOrderCard: {
        position: 'absolute',
        bottom: 80, // Above tabs
        left: 20,
        right: 86, // Leave space for chat button
        backgroundColor: COLORS.secondary,
        borderRadius: THEME.borderRadius.m,
        padding: THEME.spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    liveOrderInfo: {
        flex: 1,
    },
    liveOrderTitle: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    liveOrderStatus: {
        color: COLORS.white,
        fontSize: 12,
        opacity: 0.9,
    },
    liveOrderBadge: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    liveOrderBadgeText: {
        color: COLORS.secondary,
        fontWeight: 'bold',
        fontSize: 10,
    },
});
