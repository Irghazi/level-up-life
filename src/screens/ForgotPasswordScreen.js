import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import NeoView from '../components/NeoView';
import NeoButton from '../components/NeoButton';
import NeoTextInput from '../components/NeoTextInput';

const { width } = Dimensions.get('window');

// Step 1: Email input
// Step 2: OTP verification
// Step 3: New password

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const toast = useToast();
  const otpRefs = useRef([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const slideToNextStep = () => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  // Step 1: Verify email
  const handleVerifyEmail = async () => {
    if (!email) {
      setErrors({ email: 'Email harus diisi' });
      shake();
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Format email tidak valid' });
      shake();
      return;
    }
    setIsLoading(true);
    // Simulate sending OTP
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setErrors({});
    slideToNextStep();
    setStep(2);
    toast.success('Kode OTP Terkirim! 📧', `OTP dikirim ke ${email}. Demo: gunakan 1 2 3 4 5`);
  };

  // Step 2: Handle OTP input
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next box
    if (value && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 5) {
      setErrors({ otp: 'Masukkan 5 digit kode OTP' });
      shake();
      return;
    }
    // Demo: accept "12345" as valid OTP
    if (enteredOtp !== '12345') {
      setErrors({ otp: 'Kode OTP tidak valid!' });
      shake();
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    setErrors({});
    slideToNextStep();
    setStep(3);
  };

  // Step 3: Save new password
  const handleSavePassword = async () => {
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = 'Password baru harus diisi';
    else if (newPassword.length < 6) newErrors.newPassword = 'Password minimal 6 karakter';
    if (!confirmPassword) newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Password tidak cocok!';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      shake();
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success('Password Berhasil Diubah! 🎉', 'Silakan login dengan password baru kamu.');
    setTimeout(() => navigation.navigate('Login'), 1800);
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.heading}>KAMU LUPA PASSWORD?</Text>
      <Text style={styles.subheading}>Masukkan email yang kamu daftarkan</Text>

      <Text style={styles.label}>Masukkan Email yang terdaftar</Text>
      <NeoView style={{ marginBottom: 4 }} innerStyle={[styles.inputWrapper, errors.email && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder="Masukan email anda"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (errors.email) setErrors({});
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </NeoView>
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <NeoButton
        style={{ marginTop: 6 }}
        innerStyle={[styles.actionBtn, isLoading && styles.btnDisabled]}
        onPress={handleVerifyEmail}
        disabled={isLoading}
      >
        {isLoading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.actionBtnText}>Verifikasi Email</Text>
        }
      </NeoButton>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.heading}>KAMU LUPA PASSWORD?</Text>
      <Text style={styles.subheading}>Masukkan email yang kamu daftarkan</Text>

      <Text style={styles.label}>Masukkan Email yang terdaftar</Text>
      <NeoView style={{ marginBottom: 4 }} innerStyle={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={email}
          editable={false}
          placeholderTextColor="#aaa"
        />
      </NeoView>

      <Text style={styles.otpHint}>Masukan kode otp yang telah dikirim melalui email</Text>

      {/* OTP Boxes */}
      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <NeoTextInput
            key={index}
            ref={ref => otpRefs.current[index] = ref}
            style={{ flex: 1 }}
            innerStyle={[
              styles.otpBox,
              digit ? styles.otpBoxFilled : null,
              errors.otp ? styles.otpBoxError : null,
            ]}
            value={digit}
            onChangeText={(v) => handleOtpChange(v.replace(/[^0-9]/g, ''), index)}
            onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>
      {errors.otp ? <Text style={[styles.errorText, { textAlign: 'center' }]}>{errors.otp}</Text> : null}

      <NeoButton
        style={{ marginTop: 8 }}
        innerStyle={[styles.actionBtn, isLoading && styles.btnDisabled]}
        onPress={handleConfirmOtp}
        disabled={isLoading}
      >
        {isLoading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.actionBtnText}>Konfirmasi</Text>
        }
      </NeoButton>

      <TouchableOpacity style={styles.resendBtn} onPress={() => toast.info('OTP Dikirim Ulang 📨', 'Kode OTP baru telah dikirim ke emailmu.')}>
        <Text style={styles.resendText}>Kirim ulang kode OTP</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.label}>Masukkan password baru</Text>
      <NeoView style={{ marginBottom: 4 }} innerStyle={[styles.inputWrapper, errors.newPassword && styles.inputError]}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Masukkan password baru kamu"
          placeholderTextColor="#aaa"
          value={newPassword}
          onChangeText={(t) => {
            setNewPassword(t);
            if (errors.newPassword) setErrors({ ...errors, newPassword: null });
          }}
          secureTextEntry={!showNewPass}
        />
        <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)} style={styles.eyeBtn}>
          <Ionicons name={showNewPass ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
      </NeoView>
      {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

      <Text style={styles.label}>Konfirmasi password baru</Text>
      <NeoView style={{ marginBottom: 4 }} innerStyle={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Konfirmasi password baru kamu"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={(t) => {
            setConfirmPassword(t);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
          }}
          secureTextEntry={!showConfirmPass}
        />
        <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)} style={styles.eyeBtn}>
          <Ionicons name={showConfirmPass ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
      </NeoView>
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      <NeoButton
        style={{ marginTop: 8 }}
        innerStyle={[styles.actionBtn, isLoading && styles.btnDisabled]}
        onPress={handleSavePassword}
        disabled={isLoading}
      >
        {isLoading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.actionBtnText}>Simpan</Text>
        }
      </NeoButton>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background */}
      <Image
        source={require('../../assets/bg_rpg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => step === 1 ? navigation.goBack() : setStep(step - 1)}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/logo_lul.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Step indicator */}
          <View style={styles.stepRow}>
            {[1, 2, 3].map(s => (
              <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
            ))}
          </View>

          {/* Form Card */}
          <Animated.View style={[{ transform: [{ translateX: shakeAnim }, { translateY: slideAnim }] }]}>
            <NeoView style={{ marginBottom: 20 }} innerStyle={styles.card}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            </NeoView>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Image
              source={require('../../assets/logo_tg.png')}
              style={styles.footerLogo}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: 180,
    height: 110,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  stepDotActive: {
    backgroundColor: '#22C55E',
    width: 22,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 22,
    borderWidth: 2,
    borderColor: '#000',
  },
  heading: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A2340',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 12,
    color: '#888',
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#FF4D4D',
    marginBottom: 8,
    marginLeft: 2,
  },
  otpHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    marginBottom: 14,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  otpBox: {
    flex: 1,
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: '#4A6CF7',
    backgroundColor: '#EEF2FF',
  },
  otpBoxError: {
    borderColor: '#FF4D4D',
  },
  actionBtn: {
    backgroundColor: '#00FF87',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
  resendBtn: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 13,
    color: '#4A6CF7',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingBottom: 10,
  },
  footerLogo: {
    width: 150,
    height: 42,
    tintColor: '#fff',
  },
});

export default ForgotPasswordScreen;
