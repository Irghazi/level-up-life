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
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
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
    if (!email) newErrors.email = 'Email harus diisi';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email tidak valid';
    if (!password) newErrors.password = 'Password harus diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      shake();
      return;
    }
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (!result.success) {
      shake();
      toast.error('Login Gagal', result.message);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Segera Hadir! 🚀', 'Fitur login dengan Google sedang dalam pengembangan.');
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

      {/* Dark overlay for readability */}
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
            {/* Heading */}
            <Text style={styles.heading}>SELAMAT DATANG 👋</Text>
            <Text style={styles.subheading}>Email kamu akan dipakai untuk proses login</Text>

            {/* Email Input */}
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Masukan email anda"
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
                placeholder="Masukkan Password anda"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Lupa password ?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.btnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Atau</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleLogin}
              activeOpacity={0.85}
            >
              <AntDesign name="google" size={20} color="#EA4335" />
              <Text style={styles.googleBtnText}>Lanjut dengan Google</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Daftar disini</Text>
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
    fontSize: 26,
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
  forgotBtn: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 18,
  },
  forgotText: {
    fontSize: 12,
    color: '#6B7EFF',
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 10,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    gap: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 13,
    color: '#666',
  },
  registerLink: {
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

export default LoginScreen;
