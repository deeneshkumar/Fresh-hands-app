import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MessageCircle } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';

const FloatingChatButton = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Chat')}
                activeOpacity={0.8}
            >
                <MessageCircle color={COLORS.white} size={28} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90, // Above the tab bar (approx 70 tab bar height + 20 spacing)
        right: THEME.spacing.m,
        zIndex: 1000,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default FloatingChatButton;
