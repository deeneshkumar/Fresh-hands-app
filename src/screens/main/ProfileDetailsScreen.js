import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react-native'; // Changed icons
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function ProfileDetailsScreen({ navigation }) {
    const { user, updateUserProfile } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [city, setCity] = useState(user?.city || '');
    const [address, setAddress] = useState(user?.address || ''); // Added address state
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !email || !phone) {
            Alert.alert('Error', 'Name, Email and Phone are required');
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            updateUserProfile({ name, email, phone, city, address }); // Included address in update
            setIsLoading(false);
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color={COLORS.text} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <User color={COLORS.white} size={40} />
                        </View>
                        <TouchableOpacity style={styles.changePhotoBtn}>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            icon={<User color={COLORS.textLight} size={20} />}
                            style={styles.input}
                        />
                        <Input
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            icon={<Mail color={COLORS.textLight} size={20} />}
                            style={styles.input}
                        />
                        <Input
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            icon={<Phone color={COLORS.textLight} size={20} />}
                            style={styles.input}
                        />
                        <Input
                            label="City"
                            value={city}
                            onChangeText={setCity}
                            placeholder="Enter your city"
                            icon={<MapPin color={COLORS.textLight} size={20} />}
                            style={styles.input}
                        />
                        <Input
                            label="Address"
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Enter your full address"
                            multiline
                            numberOfLines={3}
                            inputStyle={{ height: 80, textAlignVertical: 'top' }} // Use inputStyle for the text box
                            style={styles.input} // Container style
                            icon={<MapPin color={COLORS.textLight} size={20} />}
                        />

                        <Button
                            title="Save Changes"
                            onPress={handleSave}
                            isLoading={isLoading}
                            style={styles.saveBtn}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        padding: THEME.spacing.l,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: THEME.spacing.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: THEME.spacing.s,
        borderWidth: 4,
        borderColor: COLORS.surface,
        elevation: 5,
    },
    changePhotoBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    changePhotoText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    form: {
        gap: THEME.spacing.m,
    },
    input: {
        marginBottom: THEME.spacing.s,
    },
    saveBtn: {
        marginTop: THEME.spacing.l,
    },
});
