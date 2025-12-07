import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, CheckCircle, Briefcase, TrendingUp, Clock } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function PartnerScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = () => {
        if (!name || !phone || !category) {
            Alert.alert('Missing Details', 'Please fill in all fields.');
            return;
        }
        Alert.alert('Success', 'Thank you for your interest! We will contact you shortly.');
        setName('');
        setPhone('');
        setCategory('');
    };

    const BenefitItem = ({ icon: Icon, title, description }) => (
        <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
                <Icon color={COLORS.primary} size={24} />
            </View>
            <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{title}</Text>
                <Text style={styles.benefitDesc}>{description}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Partner with Fresh Hands</Text>
                <Text style={styles.subtitle}>Empowering Professionals. Delivering Excellence.</Text>
                <Text style={styles.description}>Join our network of professionals and grow your business.</Text>

                {/* Benefits Section */}
                <Text style={styles.sectionTitle}>Why Partner with Us?</Text>
                <BenefitItem
                    icon={TrendingUp}
                    title="Grow Your Business"
                    description="Get access to thousands of customers looking for your services."
                />
                <BenefitItem
                    icon={Briefcase}
                    title="Flexible Work"
                    description="Work on your own terms. Choose when and where you want to work."
                />
                <BenefitItem
                    icon={Clock}
                    title="Timely Payments"
                    description="Get paid directly to your bank account with transparent earnings."
                />

                {/* Registration Form */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Join Us Today</Text>
                    <Input
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                    <Input
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                    <Input
                        placeholder="Service Category (e.g., Cleaning)"
                        value={category}
                        onChangeText={setCategory}
                        style={styles.input}
                    />
                    <Button title="Submit Application" onPress={handleSubmit} />
                </View>

                {/* App Download Banner */}
                <View style={styles.banner}>
                    <View style={styles.bannerContent}>
                        <Text style={styles.bannerTitle}>Already a Partner?</Text>
                        <Text style={styles.bannerText}>Download our Partner App to manage your bookings.</Text>

                        <TouchableOpacity style={styles.downloadButton}>
                            <Download color={COLORS.white} size={20} />
                            <Text style={styles.downloadText}>Download App</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: THEME.spacing.l,
        paddingBottom: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: 8,
        fontWeight: '600',
        color: COLORS.primary,
    },
    description: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.xl,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.l,
    },
    benefitItem: {
        flexDirection: 'row',
        marginBottom: THEME.spacing.l,
        alignItems: 'flex-start',
    },
    benefitIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.m,
    },
    benefitText: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    benefitDesc: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 20,
    },
    formCard: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.l,
        borderRadius: THEME.borderRadius.l,
        marginBottom: THEME.spacing.xl,
        elevation: 4,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.l,
        color: COLORS.text,
    },
    input: {
        marginBottom: THEME.spacing.m,
    },
    banner: {
        backgroundColor: '#212121', // Dark banner
        borderRadius: THEME.borderRadius.l,
        padding: THEME.spacing.l,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    bannerText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: THEME.spacing.m,
    },
    downloadButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        alignSelf: 'flex-start',
    },
    downloadText: {
        color: COLORS.white,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
