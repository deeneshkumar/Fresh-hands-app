import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Hand } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.primaryGradientEnd]}
            style={styles.container}
        >
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }]}>
                <View style={styles.iconContainer}>
                    <Hand color={COLORS.primary} size={60} />
                </View>
                <Text style={styles.title}>Fresh Hands</Text>
                <Text style={styles.tagline}>Services at your fingertips</Text>

                <View style={styles.loadingContainer}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, { opacity: 0.7 }]} />
                    <View style={[styles.dot, { opacity: 0.4 }]} />
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        backgroundColor: COLORS.white,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    tagline: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 60,
        letterSpacing: 1,
    },
    loadingContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.white,
        marginHorizontal: 4,
    }
});
