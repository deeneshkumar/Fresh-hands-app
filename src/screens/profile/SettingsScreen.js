import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Lock, Moon, Globe, ArrowLeft, Check } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'hi', name: 'Hindi (हिंदी)' },
    { id: 'ta', name: 'Tamil (தமிழ்)' },
    { id: 'te', name: 'Telugu (తెలుగు)' },
    { id: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { id: 'ml', name: 'Malayalam (മലയാളം)' },
    { id: 'bn', name: 'Bengali (বাংলা)' },
    { id: 'mr', name: 'Marathi (मराठी)' },
    { id: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { id: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
];

export default function SettingsScreen() {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('English');
    const [showLangModal, setShowLangModal] = useState(false);

    const SettingItem = ({ icon: Icon, label, value, onToggle, onPress, type = 'toggle' }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={onPress}
            disabled={type === 'toggle'}
            activeOpacity={0.7}
        >
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
        </TouchableOpacity>
    );

    const handleLanguageSelect = (langName) => {
        setLanguage(langName);
        setShowLangModal(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
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
                    value={language}
                    type="text"
                    onPress={() => setShowLangModal(true)}
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

            <Modal
                visible={showLangModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowLangModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Language</Text>
                            <TouchableOpacity onPress={() => setShowLangModal(false)}>
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.langItem,
                                        language === item.name && styles.selectedLangItem
                                    ]}
                                    onPress={() => handleLanguageSelect(item.name)}
                                >
                                    <Text style={[
                                        styles.langText,
                                        language === item.name && styles.selectedLangText
                                    ]}>{item.name}</Text>
                                    {language === item.name && <Check size={20} color={COLORS.primary} />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.m,
        paddingVertical: THEME.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: THEME.spacing.m,
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
        marginBottom: 2,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '60%',
        padding: THEME.spacing.m,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.m,
        paddingBottom: THEME.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    closeText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    langItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedLangItem: {
        backgroundColor: COLORS.surface,
    },
    langText: {
        fontSize: 16,
        color: COLORS.text,
    },
    selectedLangText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    }
});
