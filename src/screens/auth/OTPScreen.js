import React, { useState, useRef, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import Button from '../../components/Button';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

export default function OTPScreen({ navigation, route }) {
  const { confirmation, phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array for 6 digits
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputs.current[0]) {
      setTimeout(() => inputs.current[0].focus(), 100);
    }
  }, []);

  const handleChangeText = (text, index) => {
    // Only accept numbers
    const cleanText = text.replace(/[^0-9]/g, '');

    if (cleanText.length === 0) return; // Handle backspace in onKeyPress

    const newOtp = [...otp];
    newOtp[index] = cleanText.charAt(cleanText.length - 1); // Take last char if multiple
    setOtp(newOtp);

    // Auto focus next
    if (index < 5 && cleanText) {
      inputs.current[index + 1].focus();
    }

    // Auto submit if last digit filled
    if (index === 5 && cleanText) {
      // Optional: could trigger verify here
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Current empty, go back and delete prev
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1].focus();
      } else {
        // Just clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits');
      return;
    }

    try {
      setLoading(true);
      await confirmation.confirm(otpString);
      navigation.replace('ProfileDetails', { phoneNumber });
    } catch (err) {
      console.log('OTP Verify Error:', err);
      Alert.alert('Verification failed', 'Wrong or expired OTP');
      setOtp(['', '', '', '', '', '']); // Reset on fail
      inputs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ArrowLeft color={COLORS.text} size={24} />
        <Text style={styles.backButtonText}>Change Number</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Sent to {phoneNumber}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => inputs.current[index] = ref}
            style={[
              styles.otpBox,
              digit ? styles.otpBoxFilled : null,
              // Highlight current focus could be done with state but simple logic suffices
            ]}
            keyboardType="number-pad"
            maxLength={1} // But we handle text change logic
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
          />
        ))}
      </View>

      <Button
        title={loading ? 'Verifying…' : 'Verify'}
        onPress={handleVerify}
        disabled={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: THEME.spacing.l, backgroundColor: COLORS.background },
  backButton: {
    marginBottom: THEME.spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: THEME.spacing.xl },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.xl,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: 'rgba(221, 221, 221, 1)',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  otpBoxFilled: {
    borderColor: 'rgba(78, 210, 118, 1)',
    backgroundColor: 'rgba(78, 210, 118, 0.1)', //green
  },
});
