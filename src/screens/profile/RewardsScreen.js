import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gift, Award, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

export default function RewardsScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color={COLORS.text} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.title}>My Rewards</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.balanceCard}>
                    <Gift color={COLORS.white} size={40} />
                    <Text style={styles.points}>500</Text>
                    <Text style={styles.pointsLabel}>Fresh Points</Text>
                </View>

                <Text style={styles.sectionTitle}>How to earn?</Text>
                <View style={styles.earnItem}>
                    <Award color={COLORS.secondary} size={24} />
                    <Text style={styles.earnText}>Complete 5 orders to get 100 points</Text>
                </View>
                <View style={styles.earnItem}>
                    <Award color={COLORS.secondary} size={24} />
                    <Text style={styles.earnText}>Refer a friend to get 200 points</Text>
                </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.l,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    balanceCard: {
        backgroundColor: COLORS.primary,
        borderRadius: THEME.borderRadius.l,
        padding: THEME.spacing.xl,
        alignItems: 'center',
        marginBottom: THEME.spacing.xl,
        elevation: 5,
    },
    points: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
        marginVertical: 8,
    },
    pointsLabel: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.m,
    },
    earnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
        gap: 12,
    },
    earnText: {
        fontSize: 16,
        color: COLORS.text,
    },
});
