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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const toast = useToast();
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Nama harus diisi';
    else if (name.trim().length < 2) newErrors.name = 'Nama minimal 2 karakter';
    if (!email) newErrors.email = 'Email harus diisi';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email tidak valid';
    if (!password) newErrors.password = 'Password harus diisi';
    else if (password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    if (!confirmPassword) newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Password tidak cocok!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      shake();
      return;
    }
    setIsLoading(true);
    const result = await register(name.trim(), email, password);
    setIsLoading(false);
    if (result.success) {
      toast.success('Registrasi Berhasil! 🎉', 'Silakan login dengan akun barumu.');
      setTimeout(() => navigation.navigate('Login'), 1800);
    } else {
      shake();
      toast.error('Registrasi Gagal', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Image */}
      <Image
        source={require('../../assets/bg_rpg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Dark overlay */}
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
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/logo_lul.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Form Card */}
          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            <Text style={styles.heading}>DAFTAR</Text>

            {/* Nama Input */}
            <Text style={styles.label}>Nama</Text>
            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Masukan nama anda"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                autoCapitalize="words"
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            {/* Email Input */}
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Masukkan email anda"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Masukan password anda"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* Confirm Password Input */}
            <Text style={styles.label}>Konfirmasi Password</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Masukan Password anda"
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerBtn, isLoading && styles.btnDisabled]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>Lanjutkan</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Sudah Punya Akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login Disini</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 180,
    height: 110,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A2340',
    marginBottom: 18,
    letterSpacing: 1,
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
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
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
    marginBottom: 6,
    marginLeft: 2,
  },
  registerBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 14,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  registerBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 13,
    color: '#666',
  },
  loginLink: {
    fontSize: 13,
    color: '#4A6CF7',
    fontWeight: '700',
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

export default RegisterScreen;
