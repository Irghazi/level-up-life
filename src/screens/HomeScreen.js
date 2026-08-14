import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const NEO = {
  bg: '#FFFFFF',
  yellow: '#FFE500',
  black: '#0D0D0D',
  white: '#FFFFFF',
  green: '#00C853',
  red: '#FF3B30',
  blue: '#3A86FF',
  seaBlue: '#00B4D8',
  purple: '#9B5DE5',
  orange: '#FF6B35',
  pink: '#FF006E',
};

const getBarColor = (value) => {
  const percentage = value * 100;
  if (percentage >= 50) return NEO.green;   // >= 50% -> Hijau
  if (percentage >= 40) return NEO.yellow;  // 40% - 49% -> Kuning
  return NEO.red;                           // < 40% -> Merah
};

const WEEK_DATA = [
  { day: 'Sen', value: 0.85 }, // 85% -> Hijau
  { day: 'Sel', value: 0.45 }, // 45% -> Kuning
  { day: 'Rab', value: 0.90 }, // 90% -> Hijau
  { day: 'Kam', value: 0.35 }, // 35% -> Merah
  { day: 'Jum', value: 0.70 }, // 70% -> Hijau
  { day: 'Sab', value: 0.42 }, // 42% -> Kuning
  { day: 'Min', value: 0.30 }, // 30% -> Merah
];

// Neobrutalism card with hard shadow
const NeoCard = ({ children, style, color = NEO.white, onPress }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={!onPress}>
    <View style={[neoCardStyles.shadow, style?.shadow]}>
      <View style={[neoCardStyles.card, { backgroundColor: color }, style?.card]}>
        {children}
      </View>
    </View>
  </TouchableOpacity>
);
const neoCardStyles = StyleSheet.create({
  shadow: {
    marginBottom: 4,
    marginRight: 4,
  },
  card: {
    borderWidth: 2.5,
    borderColor: NEO.black,
    borderRadius: 14,
    shadowColor: NEO.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
});

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');

  const firstName = user?.name?.split(' ')[0] || 'User';

  const handleLogout = () => {
    logout();
    toast.info('Sampai jumpa! 👋', 'Kamu telah keluar dari akun.');
  };

  const handleFeaturePress = (name) => {
    toast.info(`${name}`, 'Fitur ini segera hadir!');
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
      <StatusBar barStyle="dark-content" backgroundColor={NEO.white} />

      {/* NEO HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Avatar */}
          <View style={styles.avatarShadow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.haloText}>{t('halo')}</Text>
            <Text style={styles.nameText}>{firstName.toUpperCase()} 👋</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtnShadow} onPress={() => handleFeaturePress('Shop 🛍️')}>
            <View style={styles.iconBtn}>
              <Ionicons name="bag-handle-outline" size={20} color={NEO.black} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtnShadow} onPress={() => handleFeaturePress('Trophy 🏆')}>
            <View style={styles.iconBtn}>
              <Ionicons name="trophy-outline" size={20} color={NEO.black} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* MASCOT CARD */}
        <View style={styles.mascotShadow}>
          <View style={styles.mascotCard}>
            <Image
              source={require('../../assets/mascot.png')}
              style={styles.mascotImage}
              resizeMode="contain"
            />
            <View style={styles.speechSection}>
              <View style={styles.speechBubbleShadow}>
                <View style={styles.speechBubble}>
                  <Text style={styles.speechTitle}>Hai {firstName}! 🌟</Text>
                  <Text style={styles.speechText}>{t('startDayMascot')}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.startBtnShadow}
                onPress={() => navigation.navigate('Todo')}
              >
                <View style={styles.startBtn}>
                  <Text style={styles.startBtnText}>{t('startNow')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* STATS SECTION */}
        <Text style={styles.sectionTitle}>{t('weeklyStats')}</Text>
        <View style={styles.statsShadow}>
          <View style={styles.statsCard}>
            <View style={styles.chartBars}>
              {WEEK_DATA.map((item, idx) => {
                const barColor = getBarColor(item.value);
                return (
                  <View key={idx} style={styles.barWrapper}>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, {
                        height: `${item.value * 100}%`,
                        backgroundColor: barColor,
                      }]} />
                    </View>
                    <Text style={styles.barLabel}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* FEATURE CARDS */}
        <Text style={styles.sectionTitle}>{t('featuredHighlights')}</Text>
        <View style={styles.cardsGrid}>

          {/* Streak */}
          <NeoCard
            color={NEO.seaBlue}
            style={{ card: styles.featureCardInner }}
            onPress={() => handleFeaturePress('🔥 99 Days Streak')}
          >
            <MaterialCommunityIcons name="star-circle" size={30} color={NEO.white} />
            <Text style={styles.cardBig}>99 DAYS</Text>
            <Text style={styles.cardSub}>{t('streakSub')}</Text>
          </NeoCard>

          {/* Tugas */}
          <NeoCard
            color={NEO.green}
            style={{ card: styles.featureCardInner }}
            onPress={() => navigation.navigate('Todo')}
          >
            <MaterialCommunityIcons name="target" size={30} color={NEO.white} />
            <Text style={styles.cardBig}>80</Text>
            <Text style={styles.cardSub}>{t('tasksCompletedSub')}</Text>
          </NeoCard>

          {/* Daily Login */}
          <NeoCard
            color={NEO.orange}
            style={{ card: styles.featureCardInner }}
            onPress={() => toast.success('Daily Login! 🎁', 'Reward harian berhasil diklaim!')}
          >
            <MaterialCommunityIcons name="calendar-check" size={30} color={NEO.white} />
            <Text style={styles.cardBig}>DAILY</Text>
            <Text style={styles.cardSub}>{t('dailyClaimSub')}</Text>
          </NeoCard>

          {/* Pet */}
          <NeoCard
            color={NEO.purple}
            style={{ card: styles.featureCardInnerLight }}
            onPress={() => handleFeaturePress('🐾 Pet')}
          >
            <MaterialCommunityIcons name="paw" size={30} color={NEO.white} />
            <Text style={styles.cardBig}>PET</Text>
            <Text style={styles.cardSub}>{t('viewPetSub')}</Text>
          </NeoCard>

        </View>

        {/* CHAT PROMO */}
        <TouchableOpacity onPress={() => { setActiveTab('chat'); navigation.navigate('Chat'); }}>
          <View style={styles.chatPromoBg}>
            <View style={styles.chatPromoCard}>
              <Image source={require('../../assets/mellisa.png')} style={styles.chatPromoAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.chatPromoTitle}>{t('chatPromoTitle')}</Text>
                <Text style={styles.chatPromoSub}>{t('chatPromoSub')}</Text>
              </View>
              <View style={styles.chatArrowShadow}>
                <View style={styles.chatArrow}>
                  <Ionicons name="arrow-forward" size={18} color={NEO.black} />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
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
                if (item.key === 'chat') navigation.navigate('Chat');
                else if (item.key === 'group') navigation.navigate('Guild');
                else if (item.key === 'profile') navigation.navigate('Profile');
                else if (item.key !== 'home') handleFeaturePress(item.label);
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
  container: { flex: 1, backgroundColor: NEO.bg },

  // HEADER
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
  haloText: { fontSize: 10, fontWeight: '800', color: NEO.black, letterSpacing: 2 },
  nameText: { fontSize: 18, fontWeight: '900', color: NEO.black, letterSpacing: 1 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtnShadow: {
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: { padding: 16, gap: 12 },

  // MASCOT
  mascotShadow: {
    shadowColor: NEO.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  mascotCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: NEO.white,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: NEO.black,
    overflow: 'hidden',
    padding: 12,
    paddingLeft: 0,
    minHeight: 170,
  },
  mascotImage: { width: 120, height: 170, marginLeft: -4 },
  speechSection: { flex: 1, gap: 10, paddingBottom: 4 },
  speechBubbleShadow: {
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  speechBubble: {
    backgroundColor: NEO.yellow,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: NEO.black,
    padding: 10,
  },
  speechTitle: { fontSize: 14, fontWeight: '900', color: NEO.black, marginBottom: 3 },
  speechText: { fontSize: 12, fontWeight: '600', color: NEO.black, lineHeight: 18 },
  startBtnShadow: {
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  startBtn: {
    backgroundColor: NEO.black,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: NEO.black,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  startBtnText: { fontSize: 11, fontWeight: '900', color: NEO.yellow, letterSpacing: 0.5 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
    marginTop: 4,
  },

  // STATS
  statsShadow: {
    shadowColor: NEO.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  statsCard: {
    backgroundColor: NEO.white,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: NEO.black,
    padding: 16,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
  },
  barWrapper: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: {
    width: 20,
    height: 90,
    backgroundColor: '#F0F0E8',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: NEO.black,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 4 },
  barLabel: { fontSize: 9, color: NEO.black, fontWeight: '800', textAlign: 'center' },

  // FEATURE CARDS
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCardInner: {
    width: (width - 56) / 2,
    padding: 14,
    gap: 4,
  },
  featureCardInnerLight: {
    width: (width - 56) / 2,
    padding: 14,
    gap: 4,
  },
  cardBig: { fontSize: 16, fontWeight: '900', color: NEO.white, marginTop: 4 },
  cardSub: { fontSize: 11, fontWeight: '700', color: NEO.white },

  // CHAT PROMO
  chatPromoBg: {
    shadowColor: NEO.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    marginTop: 4,
  },
  chatPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO.blue,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: NEO.black,
    padding: 14,
    gap: 12,
  },
  chatPromoAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
  },
  chatPromoTitle: { fontSize: 14, fontWeight: '900', color: NEO.white },
  chatPromoSub: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  chatArrowShadow: {
    shadowColor: NEO.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  chatArrow: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.yellow,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: NEO.white,
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

export default HomeScreen;
