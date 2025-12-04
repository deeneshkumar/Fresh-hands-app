import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, Clock } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';

export default function ServiceCard({ service, onPress, horizontal = false }) {
    return (
        <TouchableOpacity
            style={[styles.container, horizontal && styles.horizontalContainer]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                {service.image ? (
                    <Image source={{ uri: service.image }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholder} />
                )}
                <View style={styles.ratingBadge}>
                    <Star size={10} color={COLORS.white} fill={COLORS.white} />
                    <Text style={styles.ratingText}>{service.rating}</Text>
                </View>
                {service.isPopular && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>BESTSELLER</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>{service.name}</Text>
                <View style={styles.row}>
                    <Text style={styles.price}>₹{service.price}</Text>
                    <Text style={styles.reviews}>(1.2k reviews)</Text>
                </View>
                <View style={styles.marketingRow}>
                    <Clock size={12} color={COLORS.success} />
                    <Text style={styles.marketingText}>Arrives in 30 mins</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
        overflow: 'hidden',
        width: '100%', // Flexible width for grid layout
    },
    horizontalContainer: {
        width: 160,
        marginRight: THEME.spacing.m,
        marginBottom: 2, // Adjust for shadow
    },
    imageContainer: {
        height: 100,
        backgroundColor: COLORS.surface,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.border,
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    popularBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    popularText: {
        color: COLORS.text,
        fontSize: 8,
        fontWeight: 'bold',
    },
    content: {
        padding: THEME.spacing.s,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    reviews: {
        fontSize: 10,
        color: COLORS.textLight,
    },
    marketingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    marketingText: {
        fontSize: 10,
        color: COLORS.success,
        fontWeight: '500',
    },
});
