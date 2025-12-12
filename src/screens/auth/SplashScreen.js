import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    // Animation Values
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleScale = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleOpacity, {
                toValue: 1,
                duration: 400, // Reduced duration
                useNativeDriver: true,
            }),
            Animated.spring(titleScale, {
                toValue: 1,
                bounciness: 12,
                speed: 15, // Increased speed
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={{
                opacity: titleOpacity,
                transform: [{ scale: titleScale }],
                alignItems: 'center'
            }}>
                <Text style={styles.title}>Fresh Hands</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 55, // Increased size
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
        // Text shadow for "highlight" effect
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
});
