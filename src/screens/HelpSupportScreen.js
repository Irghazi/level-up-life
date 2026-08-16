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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useToast } from '../components/Toast';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  yellow: '#FFE500',
  green: '#00FF00',
  cyan: '#40C4FF',
  red: '#FF4D4D',
};

const HelpSupportScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const [expandedSection, setExpandedSection] = useState('password'); // 'password' | 'task' | 'bug'

  // Bug Report Form
  const [bugSubject, setBugSubject] = useState('');
  const [bugDescription, setBugDescription] = useState('');

  const toggleSection = (section) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const handleSendBugReport = () => {
    if (!bugSubject.trim() || !bugDescription.trim()) {
      toast.error('Laporan Kosong!', 'Mohon isi judul dan deskripsi kendala.');
      return;
    }

    toast.success('Laporan Terkirim! 🐛', 'Terima kasih! Admin akan segera memeriksa laporanmu.');
    setBugSubject('');
    setBugDescription('');
  };

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NEO.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HELP & SUPPORT</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        <Text style={styles.title}>PUSAT BANTUAN</Text>
        <Text style={styles.subtitle}>
          Temukan panduan penggunaan aplikasi dan laporkan kendala atau bug langsung ke Admin.
        </Text>

        {/* 🔑 1. CARA GANTI PASSWORD */}
        <View style={styles.cardShadow}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => toggleSection('password')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: NEO.yellow }]}>
              <Ionicons name="key-outline" size={22} color={NEO.black} />
            </View>
            <Text style={styles.cardTitle}>Cara Ganti Password</Text>
            <Ionicons
              name={expandedSection === 'password' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={NEO.black}
            />
          </TouchableOpacity>

          {expandedSection === 'password' && (
            <View style={styles.cardBody}>
              <View style={styles.stepItem}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
                <Text style={styles.stepText}>
                  Buka menu <Text style={styles.boldText}>Profil / Settings</Text> di pojok kanan bawah nav bar.
                </Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
                <Text style={styles.stepText}>
                  Pilih menu <Text style={styles.boldText}>ACCOUNT & SECURITY</Text>.
                </Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
                <Text style={styles.stepText}>
                  Masukkan password saat ini, password baru, dan konfirmasi password baru.
                </Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>4</Text></View>
                <Text style={styles.stepText}>
                  Tekan tombol <Text style={styles.boldText}>SIMPAN PASSWORD BARU</Text>.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionLinkBtn}
                onPress={() => navigation.navigate('AccountSecurity')}
              >
                <Text style={styles.actionLinkText}>Buka Account & Security Sekarang →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 📝 2. CARA BUAT TASK */}
        <View style={styles.cardShadow}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => toggleSection('task')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: NEO.cyan }]}>
              <Ionicons name="add-circle-outline" size={22} color={NEO.black} />
            </View>
            <Text style={styles.cardTitle}>Cara Membuat Tugas (Task)</Text>
            <Ionicons
              name={expandedSection === 'task' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={NEO.black}
            />
          </TouchableOpacity>

          {expandedSection === 'task' && (
            <View style={styles.cardBody}>
              <View style={styles.stepItem}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
                <Text style={styles.stepText}>
                  Tekan tombol <Text style={styles.boldText}>➕ di Tengah Nav Bar</Text> atau tombol <Text style={styles.boldText}>➕ di Halaman Tugas</Text>.
                </Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
                <Text style={styles.stepText}>
                  Isi <Text style={styles.boldText}>Judul Tugas</Text>, Tanggal, Waktu Mulai & Selesai.
                </Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
                <Text style={styles.stepText}>
                  Pilih tingkat <Text style={styles.boldText}>Prioritas</Text> (misal: *Deadline mepet*) dan <Text style={styles.boldText}>Kesulitan</Text>.
                </Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>4</Text></View>
                <Text style={styles.stepText}>
                  Tekan tombol hijau <Text style={styles.boldText}>Buat tugas</Text>.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionLinkBtn}
                onPress={() => navigation.navigate('CreateTodo')}
              >
                <Text style={styles.actionLinkText}>Buat Tugas Baru Sekarang →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 🐛 3. HUBUNGI ADMIN & LAPORAN BUG */}
        <View style={styles.cardShadow}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => toggleSection('bug')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: NEO.red }]}>
              <MaterialCommunityIcons name="bug-outline" size={22} color={NEO.white} />
            </View>
            <Text style={styles.cardTitle}>Hubungi Admin / Laporan Bug</Text>
            <Ionicons
              name={expandedSection === 'bug' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={NEO.black}
            />
          </TouchableOpacity>

          {expandedSection === 'bug' && (
            <View style={styles.cardBody}>
              <Text style={styles.bugFormHint}>
                Menemukan kendala atau bug di aplikasi? Tuliskan detailnya di bawah ini, tim Admin Level Up Life akan segera menindaklanjuti.
              </Text>

              {/* Judul Kendala */}
              <Text style={styles.inputLabel}>Judul Kendala / Bug</Text>
              <View style={styles.inputShadow}>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Error saat klaim daily login"
                  placeholderTextColor="#AAA"
                  value={bugSubject}
                  onChangeText={setBugSubject}
                />
              </View>

              {/* Deskripsi Kendala */}
              <Text style={styles.inputLabel}>Deskripsi Detail Kendala</Text>
              <View style={styles.inputShadow}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Jelaskan langkah saat error terjadi..."
                  placeholderTextColor="#AAA"
                  value={bugDescription}
                  onChangeText={setBugDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Submit Bug Button */}
              <TouchableOpacity
                style={styles.sendBugShadow}
                onPress={handleSendBugReport}
                activeOpacity={0.85}
              >
                <View style={styles.sendBugBtn}>
                  <Ionicons name="paper-plane" size={18} color={NEO.black} />
                  <Text style={styles.sendBugText}>Kirim Laporan Bug</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    gap: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  cardShadow: {
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    boxShadow: '2px 2px 0px #0D0D0D',
    backgroundColor: NEO.white,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: NEO.black,
    flex: 1,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 2,
    borderTopColor: NEO.black,
    backgroundColor: '#FAFAFA',
    gap: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: NEO.black,
    backgroundColor: NEO.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '900',
    color: NEO.black,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    lineHeight: 19,
  },
  boldText: {
    fontWeight: '900',
    color: NEO.black,
  },
  actionLinkBtn: {
    marginTop: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0066FF',
    textDecorationLine: 'underline',
  },
  bugFormHint: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: NEO.black,
    marginTop: 4,
  },
  inputShadow: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '600',
    color: NEO.black,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendBugShadow: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    boxShadow: '2px 2px 0px #0D0D0D',
    marginTop: 8,
  },
  sendBugBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO.green,
    paddingVertical: 12,
    gap: 8,
  },
  sendBugText: {
    fontSize: 14,
    fontWeight: '900',
    color: NEO.black,
  },
});

export default HelpSupportScreen;
