import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
    const backgroundColor = disabled
        ? COLORS.textLight
        : variant === 'primary'
            ? COLORS.primary
            : COLORS.white;

    const textColor = variant === 'primary' ? COLORS.white : COLORS.primary;
    const border = variant === 'outline' ? { borderWidth: 1, borderColor: COLORS.primary } : {};

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor }, border, style]}
            onPress={onPress}
            disabled={!!disabled || !!loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: THEME.borderRadius.m,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
