import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Animated, LayoutAnimation, UIManager, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, Crown, Zap, Shield, Gift, Star, ThumbsUp, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const { width } = Dimensions.get('window');

const SUBSCRIPTION_BANNERS = [
    {
        id: 1,
        colors: ['#4facfe', '#00f2fe'],
        title: 'Upgrade to VIP',
        subtitle: 'Get Priority Service & Zero Fees',
        tag: 'LIMITED OFFER'
    },
    {
        id: 2,
        colors: ['#43e97b', '#38f9d7'],
        title: 'Save Big Today',
        subtitle: 'Save up to ₹2000/year on bookings',
        tag: 'BEST SAVINGS'
    },
    {
        id: 3,
        colors: ['#fa709a', '#fee140'],
        title: 'Exclusive Access',
        subtitle: 'Top-rated pros just for you',
        tag: 'PREMIUM'
    }
];

const BENEFITS = [
    { id: 1, icon: Zap, title: 'Zero Transportation Charges', desc: 'No connection fees on bookings.' },
    { id: 2, icon: Shield, title: 'Priority Support', desc: 'Dedicated line for instant help.' },
    { id: 3, icon: Crown, title: 'Top-Rated Pros', desc: 'Access to experienced partners.' },
    { id: 4, icon: Gift, title: 'Exclusive Deals', desc: 'Get member-only discounts.' },
];

const PLANS = [
    { id: 'monthly', name: 'Monthly', price: 49, duration: '1 m', tag: '' },
    { id: 'quarterly', name: '3 Months', price: 129, duration: '3 m', tag: 'POPULAR' },
    { id: 'halfYearly', name: 'Half Yearly', price: 249, duration: '6 m', tag: '' },
    { id: 'yearly', name: 'Yearly', price: 399, duration: '1 y', tag: 'BEST VALUE' },
];

export default function SubscriptionScreen() {
    const navigation = useNavigation();
    const { joinClub, user, deductFromWallet } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState('quarterly');
    const [activeBanner, setActiveBanner] = useState(0);
    const scrollRef = useRef(null);

    const selectedPlan = PLANS.find(p => p.id === selectedPlanId);

    // Auto-scroll banners
    useEffect(() => {
        const interval = setInterval(() => {
            let nextSlide = activeBanner + 1;
            if (nextSlide >= SUBSCRIPTION_BANNERS.length) {
                nextSlide = 0;
            }
            setActiveBanner(nextSlide);
            scrollRef.current?.scrollTo({ x: nextSlide * (width - 48), animated: true });
        }, 3000);
        return () => clearInterval(interval);
    }, [activeBanner]);

    const handleSelectPlan = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedPlanId(id);
    };

    const handleJoin = () => {
        if (!selectedPlan) return;

        Alert.alert(
            'Confirm Membership',
            `Join club for ₹${selectedPlan.price}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay & Join',
                    onPress: () => {
                        setLoading(true);
                        setTimeout(() => {
                            const success = deductFromWallet(selectedPlan.price);
                            if (success) {
                                joinClub();
                                setLoading(false);
                                Alert.alert('Welcome!', 'Membership activated.', [
                                    { text: 'OK', onPress: () => navigation.goBack() }
                                ]);
                            } else {
                                setLoading(false);
                                Alert.alert('Low Balance', 'Please verify your wallet balance.', [
                                    { text: 'Add Money', onPress: () => navigation.navigate('AddMoney') },
                                    { text: 'Cancel', style: 'cancel' }
                                ]);
                            }
                        }, 1000);
                    }
                }
            ]
        );
    };

    const onBannerScroll = (event) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / (width - 48));
        if (slide !== activeBanner && slide < SUBSCRIPTION_BANNERS.length) {
            setActiveBanner(slide);
        }
    };

    if (user?.isClubMember) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color={COLORS.text} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Fresh Hands Club</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.centerBox}>
                    <View style={styles.activeIcon}>
                        <Check size={40} color={COLORS.white} />
                    </View>
                    <Text style={styles.activeTitle}>Membership Active</Text>
                    <Text style={styles.activeSub}>You are enjoying all club benefits.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Fresh Hands Club</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {/* Custom Gradient Banners */}
                <View style={styles.bannerContainer}>
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onBannerScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingHorizontal: THEME.spacing.m }}
                    >
                        {SUBSCRIPTION_BANNERS.map((banner) => (
                            <View key={banner.id} style={styles.bannerItem}>
                                <LinearGradient
                                    colors={banner.colors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.bannerGradient}
                                >
                                    <View style={styles.bannerTag}>
                                        <Text style={styles.bannerTagText}>{banner.tag}</Text>
                                    </View>
                                    <View style={styles.bannerContent}>
                                        <Text style={styles.bannerTitle}>{banner.title}</Text>
                                        <Text style={styles.bannerSub}>{banner.subtitle}</Text>
                                    </View>
                                    <View style={styles.bannerIcon}>
                                        <Sparkles color="rgba(255,255,255,0.8)" size={48} />
                                    </View>
                                </LinearGradient>
                            </View>
                        ))}
                    </ScrollView>
                    {/* Pagination Dots */}
                    <View style={styles.paginationDots}>
                        {SUBSCRIPTION_BANNERS.map((_, index) => (
                            <View
                                key={index}
                                style={[styles.dot, activeBanner === index && styles.activeDot]}
                            />
                        ))}
                    </View>
                </View>

                {/* Trust/Slogan Section */}
                <View style={styles.trustSection}>
                    <Text style={styles.sloganMain}>Upgrade Your Lifestyle</Text>
                    <Text style={styles.sloganSub}>Join 50,000+ happy members saving daily.</Text>

                    <View style={styles.trustRow}>
                        <View style={styles.trustBadge}>
                            <ThumbsUp size={14} color={COLORS.primary} />
                            <Text style={styles.trustText}>100% Satisfaction</Text>
                        </View>
                        <View style={styles.trustBadge}>
                            <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
                            <Text style={styles.trustText}>4.9/5 Rating</Text>
                        </View>
                    </View>
                </View>

                {/* Benefits Grid */}
                <Text style={styles.sectionHeader}>Why Join?</Text>
                <View style={styles.benefitsGrid}>
                    {BENEFITS.map((item) => (
                        <View key={item.id} style={styles.benefitItem}>
                            <View style={styles.iconCircle}>
                                <item.icon size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.benefitInfo}>
                                <Text style={styles.benefitTitle}>{item.title}</Text>
                                <Text style={styles.benefitDesc}>{item.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Plans Selection */}
                <View style={styles.planHeaderRow}>
                    <Text style={styles.sectionHeader}>Select Plan</Text>
                    <Text style={styles.offerTag}>Limited Period Offer ⏳</Text>
                </View>

                <View style={styles.plansContainer}>
                    {PLANS.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            style={[
                                styles.planCard,
                                selectedPlanId === plan.id && styles.planCardActive
                            ]}
                            onPress={() => handleSelectPlan(plan.id)}
                            activeOpacity={0.9}
                        >
                            {plan.tag ? (
                                <View style={styles.planTag}>
                                    <Text style={styles.planTagText}>{plan.tag}</Text>
                                </View>
                            ) : null}

                            <Text style={[
                                styles.planName,
                                selectedPlanId === plan.id && styles.planTextActive
                            ]}>{plan.name}</Text>
                            <Text style={[
                                styles.planPrice,
                                selectedPlanId === plan.id && styles.planTextActive
                            ]}>₹{plan.price}</Text>
                            <Text style={styles.planDuration}>{plan.duration}</Text>

                            {selectedPlanId === plan.id && (
                                <View style={styles.checkCircle}>
                                    <Check size={12} color={COLORS.white} />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Footer with Bordered Button */}
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <View>
                        <Text style={styles.totalLabel}>Total Payable</Text>
                        <Text style={styles.totalSub}>Includes all taxes</Text>
                    </View>
                    <Text style={styles.totalValue}>₹{selectedPlan?.price}</Text>
                </View>

                <TouchableOpacity
                    style={styles.joinButtonContainer}
                    onPress={handleJoin}
                    disabled={loading}
                >
                    <View style={styles.joinButtonInner}>
                        <Text style={styles.joinButtonText}>
                            {loading ? 'Processing...' : 'Proceed to Pay'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.m,
        paddingVertical: THEME.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.background,
    },
    content: {
        paddingBottom: 160, // Fixed scroll issue: Increased padding bottom
    },
    bannerContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    bannerItem: {
        width: width - 48,
        marginRight: 16,
    },
    bannerGradient: {
        height: 160,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
        position: 'relative',
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 8,
    },
    bannerSub: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    bannerTag: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    bannerTagText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    bannerIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        opacity: 0.6,
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 20,
    },
    trustSection: {
        paddingHorizontal: THEME.spacing.m,
        marginBottom: 24,
        alignItems: 'center',
    },
    sloganMain: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    sloganSub: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 12,
        textAlign: 'center',
    },
    trustRow: {
        flexDirection: 'row',
        gap: 16,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    trustText: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: '600',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
        marginLeft: THEME.spacing.m,
    },
    benefitsGrid: {
        flexDirection: 'column',
        gap: 12,
        marginBottom: 32,
        paddingHorizontal: THEME.spacing.m,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    benefitInfo: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    benefitDesc: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    planHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: THEME.spacing.m,
    },
    offerTag: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 16,
    },
    plansContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingHorizontal: THEME.spacing.m,
    },
    planCard: {
        width: '48%', // 2 per row
        padding: 16,
        paddingVertical: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    planCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFFBE6', // Warm light active color for trust
        borderWidth: 2,
    },
    planTag: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF5722',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderBottomLeftRadius: 8,
    },
    planTagText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    planName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    planPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    planDuration: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    planTextActive: {
        color: COLORS.primary,
    },
    checkCircle: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        padding: THEME.spacing.m,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    totalSub: {
        fontSize: 10,
        color: COLORS.textLight,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    joinButtonContainer: {
        height: 54,
        borderRadius: 27,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        // Outer Button Border styling
        borderWidth: 2,
        borderColor: COLORS.primary, // Outer border color
    },
    joinButtonInner: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 30,
        width: '96%', // Slight gap for border effect
        height: '86%',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    activeIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
    },
    activeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    activeSub: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});
