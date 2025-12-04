import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, User, ChevronDown, Star, Clock, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { POPULAR_SERVICES, SERVICES, CATEGORIES } from '../../constants/dummyData';
import { useAuth } from '../../context/AuthContext';
import Banner from '../../components/Banner';
import ServiceCard from '../../components/ServiceCard';
import Footer from '../../components/Footer';

export default function HomeScreen({ navigation }) {
    const { user } = useAuth();

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
                {/* Background Theme */}
                <LinearGradient
                    colors={[COLORS.primary + '20', 'transparent']}
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
                            <TouchableOpacity style={styles.locationContainer}>
                                <MapPin color={COLORS.primary} size={16} />
                                <Text style={styles.locationText}>{user?.city || 'Select Location'}</Text>
                                <ChevronDown color={COLORS.text} size={16} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                        <User color={COLORS.primary} size={24} />
                    </TouchableOpacity>
                </View>

                {/* Hero Content */}
                <View style={styles.heroContainer}>
                    <Text style={styles.heroTitle}>Welcome back, {user?.name?.split(' ')[0] || 'Guest'}!</Text>
                    <Text style={styles.heroSubtitle}>What can we help you with today?</Text>
                </View>

                {/* Slogan 1 */}
                <View style={styles.sloganContainer}>
                    <Sparkles color={COLORS.secondary} size={16} style={{ marginRight: 8 }} />
                    <Text style={styles.sloganText}>Exclusive Offers Just For You</Text>
                </View>

                {/* Banner */}
                <Banner />

                {/* Slogan 2 */}
                <View style={styles.sloganContainer}>
                    <Text style={styles.sloganTextSecondary}>Explore Our Top Categories</Text>
                </View>

                {/* Categories - 2 Rows Horizontal Scroll */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
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

                {/* Slogan 2 */}
                <View style={styles.sloganContainer}>
                    <Text style={styles.sloganTextSecondary}>Most Booked Services This Week</Text>
                </View>

                {/* Popular Services */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Services</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Fresh Hands')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularList}>
                    {POPULAR_SERVICES.map(renderServiceCard)}
                </ScrollView>

                {/* Pagination Dots for Popular Services (Visual Only as ScrollView doesn't easily support index tracking without onScroll) */}
                <View style={styles.paginationDots}>
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>

                {/* Footer Branding */}
                <Footer />
            </ScrollView>
        </SafeAreaView>
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
        padding: THEME.spacing.m,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: THEME.spacing.s,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoButton: {
        marginRight: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 2,
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
    },
    locationLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 2,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        marginLeft: 4,
        marginRight: 4,
        fontWeight: 'bold',
        fontSize: 16,
        color: COLORS.text,
    },
    profileButton: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    heroContainer: {
        marginBottom: THEME.spacing.l,
        marginTop: THEME.spacing.s,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    sloganContainer: {
        marginBottom: THEME.spacing.m,
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
        height: 200, // Matched to ServiceCard height approx + extra content
        marginRight: THEME.spacing.m,
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m, // Added margin bottom for shadow
        elevation: 3, // Matched ServiceCard
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    categoryIconContainer: {
        height: 100,
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
});
