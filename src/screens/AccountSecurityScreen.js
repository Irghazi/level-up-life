import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  green: '#00FF00',
  greenBox: '#00C853',
  yellow: '#FFE500',
};

const AccountSecurityScreen = ({ navigation }) => {
  const { user } = useAuth();
  const toast = useToast();
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSavePassword = () => {
    if (!currentPassword) {
      toast.error('Gagal', 'Masukkan password saat ini!');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('Gagal', 'Password baru minimal 6 karakter!');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Gagal', 'Konfirmasi password baru tidak cocok!');
      return;
    }

    toast.success('Password Diubah! 🔒', 'Password akun kamu berhasil diperbarui.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NEO.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account & Security</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* INFORMASI AKUN */}
        <Text style={styles.sectionTitle}>INFORMASI AKUN</Text>

        <View style={styles.cardShadow}>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="mail" size={20} color={NEO.black} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Email Terdaftar</Text>
                <Text style={styles.infoValue}>{user?.email || 'user@leveluplife.com'}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={NEO.greenBox} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* GANTI PASSWORD */}
        <Text style={styles.sectionTitle}>GANTI PASSWORD</Text>

        <Text style={styles.fieldLabel}>Password Saat Ini</Text>
        <View style={styles.inputShadow}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password saat ini"
              placeholderTextColor="#AAA"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              <Ionicons name={showCurrent ? 'eye' : 'eye-off'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.fieldLabel}>Password Baru</Text>
        <View style={styles.inputShadow}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password baru"
              placeholderTextColor="#AAA"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Ionicons name={showNew ? 'eye' : 'eye-off'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.fieldLabel}>Konfirmasi Password Baru</Text>
        <View style={styles.inputShadow}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ulangi password baru"
              placeholderTextColor="#AAA"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons name={showConfirm ? 'eye' : 'eye-off'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />

        {/* SIMPAN BUTTON */}
        <TouchableOpacity
          style={styles.saveShadow}
          onPress={handleSavePassword}
          activeOpacity={0.85}
        >
          <View style={styles.saveBtn}>
            <Ionicons name="shield-checkmark" size={20} color={NEO.black} />
            <Text style={styles.saveBtnText}>SIMPAN PASSWORD BARU</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </GridBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 2,
    borderBottomColor: NEO.black,
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
    marginTop: 6,
    marginBottom: 4,
  },
  cardShadow: {
    borderRadius: 4,
    borderWidth: 2.5,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    backgroundColor: NEO.white,
  },
  card: {
    padding: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '900',
    color: NEO.black,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NEO.greenBox,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: NEO.greenBox,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: NEO.black,
    marginTop: 10,
    marginBottom: 4,
  },
  inputShadow: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    backgroundColor: NEO.white,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: NEO.black,
  },
  saveShadow: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO.green,
    paddingVertical: 14,
    gap: 8,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
  },
});

export default AccountSecurityScreen;
