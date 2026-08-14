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
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('profile');

  const firstName = user?.name?.split(' ')[0] || 'FARHA';

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
    { key: 'profile', icon: 'person-circle', label: 'Profil' },
  ];

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarShadow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>{t('settingsTitle')}</Text>
        <Text style={styles.subtitle}>{t('settingsSub')}</Text>

        {/* Settings Cards List */}
        <View style={styles.itemsList}>
          {SETTINGS_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.85}
            >
              <View style={styles.cardShadow}>
                <View style={styles.card}>
                  {/* Icon Square Box */}
                  <View style={[styles.iconBox, { backgroundColor: item.boxColor }]}>
                    <Ionicons name={item.icon} size={22} color={item.iconColor || NEO.black} />
                  </View>

                  {/* Title */}
                  <Text style={styles.itemTitle}>{item.title}</Text>

                  {/* Arrow Right */}
                  <Ionicons name="arrow-forward" size={20} color={NEO.black} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 16 }} />

        {/* LOG OUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutShadow}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <View style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color={NEO.white} />
            <Text style={styles.logoutText}>{t('logOut')}</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* NEO BOTTOM NAV */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.centerNavOuter}
                onPress={() => navigation.navigate('Todo')}
                activeOpacity={0.85}
              >
                <View style={styles.centerNavShadow} />
                <View style={styles.centerNavBtn}>
                  <Ionicons name="add" size={30} color={NEO.black} />
                </View>
              </TouchableOpacity>
            );
          }
          const isActive = activeTab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => {
                setActiveTab(item.key);
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NEO.white,
    borderBottomWidth: 3,
    borderBottomColor: NEO.black,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarShadow: {
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
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
    padding: 12,
    gap: 14,
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
    borderRadius: 4,
    borderWidth: 2.5,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginTop: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO.logoutBg,
    paddingVertical: 14,
    gap: 8,
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconActive: {
    backgroundColor: NEO.green,
    borderWidth: 2.5,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  centerNavOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    position: 'relative',
  },
  centerNavShadow: {
    position: 'absolute',
    top: 4,
    left: '50%',
    marginLeft: -26,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: NEO.black,
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
