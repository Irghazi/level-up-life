import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  green: '#00FF00',
  yellow: '#FFE500',
};

const NotificationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const [toggles, setToggles] = useState({
    taskReminders: true,
    streakAlerts: true,
    chatMessages: true,
    guildActivity: false,
    appUpdates: true,
  });

  const toggleSwitch = (key, label) => {
    const nextVal = !toggles[key];
    setToggles(prev => ({ ...prev, [key]: nextVal }));
    toast.info(
      `${label}`,
      nextVal ? 'Notifikasi diaktifkan 🔔' : 'Notifikasi dinonaktifkan 🔕'
    );
  };

  const NOTIF_CONFIGS = [
    {
      key: 'taskReminders',
      title: 'Pengingat Tugas',
      subtitle: 'Dapatkan notifikasi sebelum waktu tugas dimulai',
      icon: 'alarm-outline',
    },
    {
      key: 'streakAlerts',
      title: 'Notifikasi Daily Streak',
      subtitle: 'Ingatkan untuk menyelesaikan tugas agar streak tidak terputus',
      icon: 'flame-outline',
    },
    {
      key: 'chatMessages',
      title: 'Pesan dari Mentor',
      subtitle: 'Notifikasi saat Mentor memberikan saran atau pesan baru',
      icon: 'chatbubble-ellipses-outline',
    },
    {
      key: 'guildActivity',
      title: 'Aktivitas Guild',
      subtitle: 'Notifikasi saat ada pesan atau kegiatan guild baru',
      icon: 'shield-outline',
    },
    {
      key: 'appUpdates',
      title: 'Update & Pengumuman',
      subtitle: 'Dapatkan informasi fitur terbaru dan pengumuman aplikasi',
      icon: 'megaphone-outline',
    },
  ];

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NEO.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        <Text style={styles.sectionTitle}>PENGATURAN NOTIFIKASI</Text>

        <View style={styles.itemsList}>
          {NOTIF_CONFIGS.map((item) => {
            const isActive = toggles[item.key];
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => toggleSwitch(item.key, item.title)}
                activeOpacity={0.85}
              >
                <View style={styles.cardShadow}>
                  <View style={styles.card}>
                    <View style={styles.iconBox}>
                      <Ionicons name={item.icon} size={22} color={NEO.black} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    </View>

                    {/* Neobrutalist Toggle Switch */}
                    <View style={[styles.toggleTrack, isActive && styles.toggleTrackActive]}>
                      <View style={[styles.toggleThumb, isActive && styles.toggleThumbActive]} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  itemsList: {
    gap: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
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
  itemTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: NEO.black,
  },
  itemSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginTop: 2,
    lineHeight: 16,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: '#EEEEEE',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: NEO.green,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});

export default NotificationsScreen;
