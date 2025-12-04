import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Lock, Moon, Globe } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const SettingItem = ({ icon: Icon, label, value, onToggle, type = 'toggle' }) => (
        <View style={styles.item}>
            <View style={styles.left}>
                <Icon color={COLORS.text} size={20} />
                <Text style={styles.label}>{label}</Text>
            </View>
            {type === 'toggle' ? (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: "#767577", true: COLORS.primary }}
                    thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
                />
            ) : (
                <Text style={styles.valueText}>{value}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.headerTitle}>Settings</Text>

                <Text style={styles.sectionHeader}>Preferences</Text>
                <SettingItem
                    icon={Bell}
                    label="Push Notifications"
                    value={notifications}
                    onToggle={setNotifications}
                />
                <SettingItem
                    icon={Moon}
                    label="Dark Mode"
                    value={darkMode}
                    onToggle={setDarkMode}
                />
                <SettingItem
                    icon={Globe}
                    label="Language"
                    value="English"
                    type="text"
                />

                <Text style={styles.sectionHeader}>Privacy</Text>
                <TouchableOpacity style={styles.item}>
                    <View style={styles.left}>
                        <Lock color={COLORS.text} size={20} />
                        <Text style={styles.label}>Change Password</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                    <View style={styles.left}>
                        <Lock color={COLORS.text} size={20} />
                        <Text style={styles.label}>Privacy Policy</Text>
                    </View>
                </TouchableOpacity>
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.l,
    },
    sectionHeader: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.s,
        marginTop: THEME.spacing.m,
        textTransform: 'uppercase',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: 2, // Small gap for list effect
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        fontSize: 16,
        color: COLORS.text,
    },
    valueText: {
        color: COLORS.textLight,
        fontSize: 14,
    }
});
