import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Phone, Mail, HelpCircle, ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

export default function SupportScreen({ navigation }) {
    const handleCall = () => Linking.openURL('tel:1800123456');
    const handleEmail = () => Linking.openURL('mailto:support@freshhands.com');

    const SupportItem = ({ icon: Icon, title, subtitle, onPress }) => (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Icon color={COLORS.primary} size={24} />
            </View>
            <View style={styles.info}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemSubtitle}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    {/* Empty container to help layout if needed, or just let title flow */}
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <Text style={styles.headerSub}>How can we help you today?</Text>

                <SupportItem
                    icon={MessageCircle}
                    title="Chat with Us"
                    subtitle="Start a live chat for instant support"
                    onPress={() => navigation.navigate('Chat')} // Assuming 'Chat' is the route name for ChatScreen
                />
                <SupportItem
                    icon={Phone}
                    title="Call Us"
                    subtitle="+91 1800-123-456"
                    onPress={handleCall}
                />
                <SupportItem
                    icon={Mail}
                    title="Email Us"
                    subtitle="support@freshhands.com"
                    onPress={handleEmail}
                />
                <SupportItem
                    icon={HelpCircle}
                    title="FAQs"
                    subtitle="Frequently Asked Questions"
                    onPress={() => { }} // Placeholder if no FAQ screen yet
                />
            </View>
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
        paddingHorizontal: THEME.spacing.m,
        paddingTop: THEME.spacing.m,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        padding: THEME.spacing.m,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    headerSub: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.xl,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
        elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 87, 34, 0.1)', // Primary color with opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.m,
    },
    info: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    itemSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
    },
});
