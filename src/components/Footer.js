import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { THEME } from '../constants/theme';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function Footer() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/footer_branding.jpg')}
                style={styles.brandingImage}
                resizeMode="cover"
            />
            <View style={styles.copyrightContainer}>
                <Text style={styles.copyrightText}>© 2024 Fresh Hands. All rights reserved.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: -20,
    },
    brandingImage: {
        width: width,
        height: 425,
    },
    copyrightContainer: {
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    copyrightText: {
        color: COLORS.textLight,
        fontSize: 10,
    },
});
