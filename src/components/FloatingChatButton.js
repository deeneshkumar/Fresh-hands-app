import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';

const FloatingChatButton = () => {
    const navigation = useNavigation();

    const handlePress = () => {
        // Navigate to ChatScreen or open chat modal
        navigation.navigate('Chat');
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            <TouchableOpacity
                style={styles.button}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <Ionicons name="chatbubble-ellipses-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        zIndex: 1000,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 20,
        // Ensure the container doesn't block interactions with valid content below it
        // by using pointerEvents="box-none" in the View props
    },
    button: {
        backgroundColor: COLORS.primary || '#007AFF', // Fallback color if COLORS.primary is undefined
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default FloatingChatButton;
