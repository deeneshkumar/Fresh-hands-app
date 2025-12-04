import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { OFFERS } from '../constants/dummyData';

const { width } = Dimensions.get('window');

export default function Banner({ containerStyle }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextSlide = activeSlide + 1;
            if (nextSlide >= OFFERS.length) {
                nextSlide = 0;
            }
            setActiveSlide(nextSlide);
            scrollViewRef.current?.scrollTo({ x: nextSlide * (width - 32), animated: true });
        }, 4000); // Auto-scroll every 4 seconds

        return () => clearInterval(interval);
    }, [activeSlide]);

    const onScroll = (event) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / (width - 32));
        if (slide !== activeSlide) {
            setActiveSlide(slide);
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {OFFERS.map((offer) => (
                    <TouchableOpacity key={offer.id} activeOpacity={0.9}>
                        <ImageBackground
                            source={{ uri: offer.image }}
                            style={styles.slide}
                            imageStyle={{ borderRadius: THEME.borderRadius.l }}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.8)']}
                                style={styles.gradient}
                            >
                                <View style={styles.content}>
                                    <Text style={styles.title}>{offer.title}</Text>
                                    <Text style={styles.subtitle}>{offer.subtitle}</Text>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Claim Now</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.pagination}>
                {OFFERS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            activeSlide === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: THEME.spacing.l,
    },
    slide: {
        width: width - 32, // Full width minus padding
        height: 180,
        borderRadius: THEME.borderRadius.l,
        overflow: 'hidden', // Ensure image stays within radius
        marginRight: 0, // Remove margin right as paging handles it
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: THEME.spacing.l,
        borderRadius: THEME.borderRadius.l,
    },
    content: {
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: THEME.spacing.m,
    },
    button: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    buttonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: THEME.spacing.s,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 20,
    },
    inactiveDot: {
        backgroundColor: COLORS.border,
    },
});
