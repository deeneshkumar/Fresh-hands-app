import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { CATEGORIES, SERVICES } from '../../constants/dummyData';
import Banner from '../../components/Banner';
import Input from '../../components/Input';
import ServiceCard from '../../components/ServiceCard';

export default function FreshHandsScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredServices = SERVICES.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Background Theme */}
                <LinearGradient
                    colors={[COLORS.primary + '15', 'transparent']}
                    style={styles.backgroundTheme}
                />

                {/* Hero Header */}
                <View style={styles.heroContainer}>
                    <Text style={styles.heroTitle}>Fresh Hands Services</Text>
                    <Text style={styles.heroSubtitle}>Professional help for your home needs</Text>
                </View>

                {/* Banner */}
                <Banner containerStyle={{ marginBottom: 12 }} />

                {/* Slogan 1 */}
                <View style={styles.sloganContainer}>
                    <Sparkles color={COLORS.secondary} size={16} style={{ marginRight: 8 }} />
                    <Text style={styles.sloganText}>Verified Professionals, Guaranteed Quality</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search color={COLORS.textLight} size={20} style={styles.searchIcon} />
                    <Input
                        placeholder="Search all services..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

                {/* Category Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
                    <TouchableOpacity
                        style={[styles.categoryChip, selectedCategory === 'all' && styles.activeCategoryChip]}
                        onPress={() => setSelectedCategory('all')}
                    >
                        <Text style={[styles.categoryText, selectedCategory === 'all' && styles.activeCategoryText]}>All</Text>
                    </TouchableOpacity>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.categoryChip, selectedCategory === cat.id && styles.activeCategoryChip]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === cat.id && styles.activeCategoryText]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Slogan 2 */}
                <View style={styles.sloganContainer}>
                    <Text style={styles.sloganTextSecondary}>Choose from our wide range of services</Text>
                </View>

                {/* Services List */}
                <Text style={styles.sectionTitle}>
                    {selectedCategory === 'all' ? 'All Services' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </Text>

                <View style={styles.servicesGrid}>
                    {filteredServices.map((service) => (
                        <View key={service.id} style={styles.serviceWrapper}>
                            <ServiceCard
                                service={service}
                                onPress={() => navigation.navigate('ServiceDetail', { service })}
                            />
                        </View>
                    ))}
                </View>

                {filteredServices.length === 0 && (
                    <Text style={styles.emptyText}>No services found matching your search.</Text>
                )}
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
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    content: {
        padding: THEME.spacing.m,
        paddingBottom: 100,
    },
    heroContainer: {
        marginBottom: THEME.spacing.m,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    sloganContainer: {
        marginBottom: THEME.spacing.m,
        marginTop: THEME.spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sloganText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        fontStyle: 'italic',
    },
    sloganTextSecondary: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textLight,
        letterSpacing: 0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
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
    categoryList: {
        marginBottom: THEME.spacing.s,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeCategoryChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryText: {
        color: COLORS.text,
        fontWeight: '500',
    },
    activeCategoryText: {
        color: COLORS.white,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.m,
        color: COLORS.text,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -THEME.spacing.xs, // Negative margin to offset card padding
    },
    serviceWrapper: {
        width: '50%', // 2 columns
        padding: THEME.spacing.s, // Increased padding for better spacing
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textLight,
        marginTop: THEME.spacing.xl,
    },
});
