import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Tag, Clock, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { OFFERS } from '../../constants/dummyData';

export default function OffersScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.headerTitle}>Exclusive Offers</Text>
                <Text style={styles.headerSub}>Savings on every service, every day. Handpicked deals just for you!</Text>

                {OFFERS.map((offer) => (
                    <TouchableOpacity key={offer.id} activeOpacity={0.9} style={styles.offerCardWrapper}>
                        <LinearGradient
                            colors={[offer.color, COLORS.primaryGradientEnd]} // Use offer color or fallback
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.offerCard}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.textContainer}>
                                    <View style={styles.tagContainer}>
                                        <Tag color={COLORS.white} size={14} />
                                        <Text style={styles.tagText}>LIMITED TIME</Text>
                                    </View>
                                    <Text style={styles.offerTitle}>{offer.title}</Text>
                                    <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                                    <Text style={styles.offerDescription}>{offer.description}</Text>

                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Claim Now</Text>
                                        <ArrowRight color={offer.color} size={16} />
                                    </View>
                                </View>

                                {/* Decorative Circle */}
                                <View style={styles.decorativeCircle} />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
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
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    headerSub: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.l,
    },
    offerCardWrapper: {
        marginBottom: THEME.spacing.l,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    offerCard: {
        borderRadius: THEME.borderRadius.l,
        overflow: 'hidden',
    },
    cardContent: {
        padding: THEME.spacing.l,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 180,
    },
    textContainer: {
        flex: 1,
        zIndex: 1,
    },
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: THEME.spacing.s,
    },
    tagText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    offerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    offerSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 8,
    },
    offerDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: THEME.spacing.m,
    },
    button: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontWeight: 'bold',
        marginRight: 8,
    },
    decorativeCircle: {
        position: 'absolute',
        right: -50,
        bottom: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});
