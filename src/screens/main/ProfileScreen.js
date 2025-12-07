import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, ShoppingBag, Tag, Gift, Settings, MessageCircle, Phone, LogOut, ChevronRight, Wallet, Moon } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();


    const menuItems = [
        { icon: ShoppingBag, label: 'My Orders', onPress: () => navigation.navigate('Orders') },
        { icon: Tag, label: 'My Vouchers', onPress: () => navigation.navigate('Vouchers') },
        { icon: Gift, label: 'Rewards', onPress: () => navigation.navigate('Rewards') },
        { icon: Settings, label: 'Settings', onPress: () => navigation.navigate('Settings') },
        { icon: MessageCircle, label: 'Chat With Us', onPress: () => navigation.navigate('Chat') },
        { icon: Phone, label: 'Contact Us', onPress: () => navigation.navigate('Support') },
    ];

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: logout },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <User color={COLORS.white} size={40} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                        <Text style={styles.userPhone}>{user?.phone || '+91 98765 43210'}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ProfileDetails')}>
                            <Text style={styles.editProfile}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Wallet Section */}
                <View style={styles.walletCard}>
                    <View style={styles.walletHeader}>
                        <View style={styles.walletTitleRow}>
                            <Wallet color={COLORS.white} size={24} />
                            <Text style={styles.walletTitle}>Fresh Wallet</Text>
                        </View>
                        <Text style={styles.walletBalance}>₹ 250.00</Text>
                    </View>
                    <Text style={styles.walletSub}>Available Balance</Text>
                    <TouchableOpacity style={styles.addMoneyButton}>
                        <Text style={styles.addMoneyText}>+ Add Money</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu */}
                <View style={styles.menu}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
                            <View style={styles.menuItemLeft}>
                                <item.icon color={COLORS.primary} size={24} />
                                <Text style={styles.menuItemLabel}>{item.label}</Text>
                            </View>
                            <ChevronRight color={COLORS.textLight} size={20} />
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <View style={styles.menuItemLeft}>
                            <LogOut color={COLORS.error} size={24} />
                            <Text style={[styles.menuItemLabel, { color: COLORS.error }]}>Logout</Text>
                        </View>
                    </TouchableOpacity>
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
        marginBottom: THEME.spacing.l,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.m,
        elevation: 5,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    userPhone: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    editProfile: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    walletCard: {
        backgroundColor: COLORS.primary,
        borderRadius: THEME.borderRadius.l,
        padding: THEME.spacing.l,
        marginBottom: THEME.spacing.l,
        elevation: 5,
    },
    walletHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    walletTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    walletBalance: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    walletSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: THEME.spacing.m,
    },
    addMoneyButton: {
        backgroundColor: COLORS.white,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
    },
    addMoneyText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.l,
        elevation: 2,
    },
    themeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeLabel: {
        fontSize: 16,
        marginLeft: THEME.spacing.m,
        color: COLORS.text,
        fontWeight: '500',
    },
    menu: {
        backgroundColor: COLORS.surface,
        borderRadius: THEME.borderRadius.m,
        padding: THEME.spacing.s,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: THEME.spacing.m,
        paddingHorizontal: THEME.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemLabel: {
        fontSize: 16,
        marginLeft: THEME.spacing.m,
        color: COLORS.text,
    },
});
