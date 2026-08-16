import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';
import NeoView from '../components/NeoView';
import NeoButton from '../components/NeoButton';
import { useProfile } from '../context/ProfileContext';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  green: '#00C853',
  greenBox: '#00FF00',
  blueBox: '#C4E0E5',
  yellowBox: '#FFE500',
  seaBlueBox: '#00B4D8',
  maroonBox: '#800020', // Merah Maron
  sageBox: '#B2C9AB',
  grayBox: '#E0E0E0',
  logoutBg: '#FF3B30', // Red / Merah
};

const SETTINGS_ITEMS = [
  {
    id: 'security',
    title: 'ACCOUNT & SECURITY',
    icon: 'lock-closed-outline',
    iconLib: 'Ionicons',
    boxColor: NEO.greenBox,
  },
  {
    id: 'notifications',
    title: 'NOTIFICATIONS',
    icon: 'notifications-outline',
    iconLib: 'Ionicons',
    boxColor: NEO.yellowBox,
  },
  {
    id: 'language',
    title: 'LANGUAGE',
    icon: 'language-outline',
    iconLib: 'Ionicons',
    boxColor: NEO.seaBlueBox,
  },
  {
    id: 'privacy',
    title: 'PRIVACY',
    icon: 'eye-off-outline',
    iconLib: 'Ionicons',
    boxColor: NEO.sageBox,
  },
  {
    id: 'help',
    title: 'HELP & SUPPORT',
    icon: 'help-circle-outline',
    iconLib: 'Ionicons',
    boxColor: NEO.grayBox,
  },
];

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  const activeTab = 'profile';

  const firstName = user?.name?.split(' ')[0] || 'USER';
  const fullName = user?.name || 'User';

  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const gold = profile?.gold || 0;
  const xpNeeded = level * 100;
  const progressPercent = Math.min((xp / xpNeeded) * 100, 100);

  const maxStatVal = 10; // Fallback

  const handleLogout = () => {
    logout();
    toast.info('Sampai jumpa! 👋', 'Kamu telah keluar dari akun.');
  };

  const handleItemPress = (item) => {
    if (item.id === 'security') navigation.navigate('AccountSecurity');
    else if (item.id === 'notifications') navigation.navigate('Notifications');
    else if (item.id === 'language') navigation.navigate('Language');
    else if (item.id === 'help') navigation.navigate('HelpSupport');
    else navigation.navigate('SettingsDetail', { title: item.title });
  };

  const navItems = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'chat', icon: 'chatbubble-ellipses', label: 'Chat' },
    { key: 'add', icon: 'add', label: '', isCenter: true },
    { key: 'group', icon: 'people', label: 'Grup' },
    { key: 'profile', icon: 'settings', label: 'Pengaturan' },
  ];

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <NeoView innerStyle={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </NeoView>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{fullName}</Text>
            <Text style={styles.subtitle}>{user?.email || 'user@example.com'}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Settings */}
        <Text style={styles.title}>{t('settingsTitle')}</Text>
        <Text style={styles.subtitle}>{t('settingsSub')}</Text>

        {/* Settings Cards List */}
        <View style={styles.itemsList}>
          {SETTINGS_ITEMS.map((item) => (
            <NeoButton
              key={item.id}
              onPress={() => handleItemPress(item)}
              style={{ marginBottom: 14 }}
              innerStyle={styles.card}
            >
              {/* Icon Square Box */}
              <View style={[styles.iconBox, { backgroundColor: item.boxColor }]}>
                <Ionicons name={item.icon} size={22} color={item.iconColor || NEO.black} />
              </View>

              {/* Title */}
              <Text style={styles.itemTitle}>{item.title}</Text>

              {/* Arrow Right */}
              <Ionicons name="arrow-forward" size={20} color={NEO.black} />
            </NeoButton>
          ))}
        </View>

        <View style={{ height: 16 }} />

        {/* LOG OUT BUTTON */}
        <NeoButton
          onPress={handleLogout}
          innerStyle={styles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={22} color={NEO.white} />
          <Text style={styles.logoutText}>{t('logOut')}</Text>
        </NeoButton>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* NEO BOTTOM NAV */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <NeoButton
                key={item.key}
                innerStyle={styles.centerNavBtn}
                onPress={() => navigation.navigate('Todo')}
              >
                <Ionicons name="add" size={30} color={NEO.black} />
              </NeoButton>
            );
          }
          const isActive = activeTab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => {
                if (item.key === 'home') navigation.navigate('Home');
                else if (item.key === 'chat') navigation.navigate('Chat');
                else if (item.key === 'group') navigation.navigate('Guild');
                else if (item.key === 'profile') navigation.navigate('Profile');
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.navIconWrapper, isActive && styles.navIconActive]}>
                <Ionicons
                  name={isActive ? item.icon : `${item.icon}-outline`}
                  size={22}
                  color={isActive ? NEO.black : '#888'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </GridBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: NEO.white,
    borderBottomWidth: 3,
    borderBottomColor: NEO.black,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: NEO.black,
    marginBottom: 6,
  },
  rpgStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badgeShadow: {
    boxShadow: '2px 2px 0px #0D0D0D',
  },
  levelBadge: {
    backgroundColor: NEO.yellowBox,
    borderWidth: 2,
    borderColor: NEO.black,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '900',
    color: NEO.black,
  },
  goldBadge: {
    backgroundColor: NEO.white,
    borderWidth: 2,
    borderColor: NEO.black,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  goldText: {
    fontSize: 12,
    fontWeight: '900',
    color: NEO.black,
  },
  xpBarWrapper: {
    width: '100%',
    maxWidth: 200,
  },
  xpBarShadow: {
    boxShadow: '2px 2px 0px #0D0D0D',
  },
  xpBarContainer: {
    backgroundColor: NEO.white,
    borderWidth: 2,
    borderColor: NEO.black,
    borderRadius: 8,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  xpBarFill: {
    backgroundColor: NEO.green,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    borderRightWidth: 2,
    borderColor: NEO.black,
  },
  xpText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '900',
    color: NEO.black,
    textShadowColor: NEO.white,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  avatarShadow: {
    boxShadow: '2px 2px 0px #0D0D0D',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '900', color: NEO.black },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', gap: 14, width: '100%', paddingHorizontal: 20 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '900', color: NEO.black },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    lineHeight: 19,
    marginBottom: 4,
  },

  itemsList: {
    gap: 12,
  },
  cardShadow: {
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 14,
    backgroundColor: NEO.white,
    borderRadius: 8,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: NEO.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO.black,
    flex: 1,
    letterSpacing: 0.5,
  },

  logoutShadow: {
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    marginTop: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO.logoutBg,
    paddingVertical: 14,
    gap: 8,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.white,
    letterSpacing: 1,
  },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: NEO.white,
    borderTopWidth: 3,
    borderTopColor: NEO.black,
    paddingTop: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  navIconWrapper: {
    width: 40,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconActive: {
    backgroundColor: NEO.green,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    boxShadow: '2px 2px 0px #0D0D0D',
  },
  centerNavOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    position: 'relative',
  },

  centerNavBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
