import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Check } from 'lucide-react-native';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

import auth from '@react-native-firebase/auth';
import { isValidPhoneNumber } from '../../utils/validation';

const COUNTRIES = [
  { code: 'IN', name: 'India', dial_code: '+91', flag: 'https://flagcdn.com/w40/in.png' },
  { code: 'US', name: 'USA', dial_code: '+1', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'UK', name: 'United Kingdom', dial_code: '+44', flag: 'https://flagcdn.com/w40/gb.png' },
  { code: 'CA', name: 'Canada', dial_code: '+1', flag: 'https://flagcdn.com/w40/ca.png' },
  { code: 'AU', name: 'Australia', dial_code: '+61', flag: 'https://flagcdn.com/w40/au.png' },
  { code: 'AE', name: 'UAE', dial_code: '+971', flag: 'https://flagcdn.com/w40/ae.png' },
  { code: 'SG', name: 'Singapore', dial_code: '+65', flag: 'https://flagcdn.com/w40/sg.png' },
];

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert('Invalid number', 'Enter a valid mobile number');
      return;
    }

    try {
      setLoading(true);

      const fullPhone = `${selectedCountry.dial_code}${phoneNumber}`;

      // ✅ CORRECT FIREBASE CALL FOR NATIVE APP
      const confirmation = await auth().signInWithPhoneNumber(fullPhone);

      navigation.navigate('OTP', {
        confirmation,
        phoneNumber: fullPhone,
      });

    } catch (err) {
      console.log('OTP Error:', err);
      Alert.alert('OTP Failed', err.message || 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logoText}>Fresh Hands</Text>
            <Text style={styles.tagline}>Home services at your fingertips</Text>
          </View>

          <Text style={styles.label}>Enter your mobile number</Text>

          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.countryCodeContainer}
              onPress={() => setShowCountryPicker(true)}
            >
              <Image source={{ uri: selectedCountry.flag }} style={styles.flagSmall} />
              <Text style={styles.countryCodeText}>{selectedCountry.dial_code}</Text>
              <ChevronDown size={14} />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, '');
                  if (cleaned.length <= 10) setPhoneNumber(cleaned);
                }}
                maxLength={10}
                style={styles.textInput}
              />
            </View>
          </View>

          <Button
            title={loading ? 'Sending OTP…' : 'Continue'}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showCountryPicker} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowCountryPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={COUNTRIES}
                keyExtractor={(i) => i.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => {
                      setSelectedCountry(item);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text>{item.name} ({item.dial_code})</Text>
                    {item.code === selectedCountry.code && <Check />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: THEME.spacing.l, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: THEME.spacing.xl * 2 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: COLORS.primary },
  tagline: { fontSize: 16, color: COLORS.textLight },
  label: { fontSize: 16, fontWeight: '600', marginBottom: THEME.spacing.m },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12, // More rounded
    paddingHorizontal: 12,
    height: 56, // Match standard input height
    marginRight: 10,
    backgroundColor: COLORS.white,
  },
  flagSmall: { width: 24, height: 16, marginRight: 8, borderRadius: 2 },
  countryCodeText: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginRight: 4 },
  inputWrapper: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20, maxHeight: '60%' },
  countryItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
