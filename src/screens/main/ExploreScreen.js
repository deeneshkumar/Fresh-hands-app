import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, TrendingUp, Star, Sparkles } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { SERVICES, FEATURED_SERVICES } from '../../constants/dummyData';
import Banner from '../../components/Banner';
import Input from '../../components/Input';
import ServiceCard from '../../components/ServiceCard';

export default function ExploreScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');

    const trendingServices = SERVICES.filter(s => s.rating >= 4.8).slice(0, 5);
    const topRatedServices = SERVICES.filter(s => s.rating >= 4.7).slice(5, 10);

    return (
        <SafeAreaView style={styles.container}>
            {/* Background Theme */}
            <View style={styles.backgroundTheme} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Text style={styles.headerTitle}>Explore</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search color={COLORS.textLight} size={20} style={styles.searchIcon} />
                    <Input
                        placeholder="Search for anything..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

                {/* Top Rated Partners Banner */}
                <View style={styles.bannerContainer}>
                    <Text style={styles.bannerTitle}>Top Rated Partners</Text>
                    <Banner />
                </View>

                {/* Featured For You */}
                <View style={styles.sectionHeader}>
                    <Sparkles color={COLORS.secondary} size={20} fill={COLORS.secondary} />
                    <Text style={styles.sectionTitle}>Featured For You</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                    {FEATURED_SERVICES.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            horizontal={true}
                            onPress={() => navigation.navigate('ServiceDetail', { service })}
                        />
                    ))}
                </ScrollView>

                {/* Trending Now */}
                <View style={styles.sectionHeader}>
                    <TrendingUp color={COLORS.primary} size={20} />
                    <Text style={styles.sectionTitle}>Trending Now</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                    {trendingServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            horizontal={true}
                            onPress={() => navigation.navigate('ServiceDetail', { service })}
                        />
                    ))}
                </ScrollView>

                {/* Top Rated Services */}
                <View style={styles.sectionHeader}>
                    <Star color={COLORS.secondary} size={20} fill={COLORS.secondary} />
                    <Text style={styles.sectionTitle}>Customer Favorites</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                    {topRatedServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            horizontal={true}
                            onPress={() => navigation.navigate('ServiceDetail', { service })}
                        />
                    ))}
                </ScrollView>

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
        height: '40%',
        backgroundColor: COLORS.primary + '10', // 10% opacity primary color
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    content: {
        padding: THEME.spacing.m,
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.m,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.l,
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
        top: 14,
    },
    searchInput: {
        paddingLeft: 40,
        backgroundColor: COLORS.white,
        elevation: 2,
        borderRadius: THEME.borderRadius.m,
    },
    bannerContainer: {
        marginBottom: THEME.spacing.l,
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.s,
        color: COLORS.text,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.m,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: THEME.spacing.s,
        color: COLORS.text,
    },
    horizontalList: {
        marginBottom: THEME.spacing.xl,
    },
});
