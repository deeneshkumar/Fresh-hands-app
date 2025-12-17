import React, { useState, useRef, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';

import Button from '../../components/Button';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

export default function OTPScreen({ navigation, route }) {
  const { confirmation: initialConfirmation, phoneNumber } = route.params;
  const [confirm, setConfirm] = useState(initialConfirmation);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array for 6 digits
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const inputs = useRef([]);

  const MAX_ATTEMPTS = 5;

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputs.current[0]) {
      setTimeout(() => inputs.current[0].focus(), 100);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      setLoading(true);
      const newConfirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(newConfirmation);
      setTimer(60);
      setAttempts(0);
      setOtp(['', '', '', '', '', '']);
      Alert.alert('OTP Resent', 'A new code has been sent to your number.');
      setTimeout(() => inputs.current[0].focus(), 100);
    } catch (err) {
      console.log('Resend Error:', err);
      Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      Alert.alert(
        'Too many attempts',
        'You have exceeded the maximum number of attempts. Please resend the OTP to try again.'
      );
      return;
    }

    try {
      setLoading(true);
      await confirm.confirm(otpString);
      navigation.replace('ProfileDetails', { phoneNumber });
    } catch (err) {
      console.log('OTP Verify Error:', err);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const remaining = MAX_ATTEMPTS - newAttempts;

      if (remaining > 0) {
        Alert.alert('Verification failed', `Incorrect OTP. You have ${remaining} attempts remaining.`);
      } else {
        Alert.alert('Limit Reached', 'You have entered the wrong OTP 5 times. Please resend OTP.');
      }

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

      <View style={styles.resendContainer}>
        {timer > 0 ? (
          <Text style={styles.timerText}>
            Resend OTP in <Text style={styles.timerBold}>{timer}s</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend} disabled={loading}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
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
    fontWeight: '400',
    textAlign: 'center',
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  otpBoxFilled: {
    borderColor: 'hsla(18, 49%, 79%, 1.00)',
    backgroundColor: 'rgba(245, 244, 244, 0.63)', //green
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: THEME.spacing.l,
  },
  timerText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  timerBold: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  resendLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
