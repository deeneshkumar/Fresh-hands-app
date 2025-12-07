import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Animated, Easing } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';

const MAP_IMAGE = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop'; // Urban map view

export default function LiveTrackingMap({ style }) {
    const driverPosition = useRef(new Animated.ValueXY({ x: 30, y: 30 })).current;

    // Rotate the driver icon based on movement direction (mocked)
    const rotation = driverPosition.x.interpolate({
        inputRange: [30, 250, 280],
        outputRange: ['45deg', '135deg', '45deg']
    });

    useEffect(() => {
        const animateDriver = () => {
            Animated.loop(
                Animated.sequence([
                    // Move right
                    Animated.timing(driverPosition, {
                        toValue: { x: 250, y: 60 },
                        duration: 6000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.quad)
                    }),
                    // Move down-left
                    Animated.timing(driverPosition, {
                        toValue: { x: 100, y: 150 },
                        duration: 5000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.quad)
                    }),
                    // Move back to start
                    Animated.timing(driverPosition, {
                        toValue: { x: 30, y: 30 },
                        duration: 5000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.quad)
                    })
                ])
            ).start();
        };

        animateDriver();
    }, []);

    return (
        <View style={[styles.container, style]}>
            <ImageBackground source={{ uri: MAP_IMAGE }} style={styles.mapImage} resizeMode="cover">
                {/* Destination / User Location (Static center-ish) */}
                <View style={styles.destinationMarker}>
                    <View style={styles.markerPin}>
                        <MapPin color={COLORS.primary} size={24} fill={COLORS.white} />
                    </View>
                    <View style={styles.markerPulse} />
                </View>

                {/* Driver (Animated) */}
                <Animated.View
                    style={[
                        styles.driverMarker,
                        {
                            transform: [
                                { translateX: driverPosition.x },
                                { translateY: driverPosition.y },
                                // { rotate: rotation } // Rotation creates issues with TranslateXY combined sometimes in simple mocks without careful offsets, safer to just translate
                            ]
                        }
                    ]}
                >
                    <View style={styles.driverBg}>
                        <Navigation color={COLORS.white} size={14} fill={COLORS.white} style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                </Animated.View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: THEME.borderRadius.m,
        backgroundColor: COLORS.surface,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    destinationMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -12,
        marginTop: -24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerPin: {
        zIndex: 2,
    },
    markerPulse: {
        position: 'absolute',
        bottom: 0,
        width: 10,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1,
    },
    driverMarker: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
    },
    driverBg: {
        backgroundColor: COLORS.secondary,
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.white,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});
