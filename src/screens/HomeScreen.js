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
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import NeoRadarChart from '../components/NeoRadarChart';
import NeoView from '../components/NeoView';
import NeoButton from '../components/NeoButton';

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



const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const { profile, hp, maxHp } = useProfile();
  const insets = useSafeAreaInsets();
  const activeTab = 'home';
  const [selectedStat, setSelectedStat] = useState(null);

  const firstName = user?.name?.split(' ')[0] || 'User';
  
  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const gold = profile?.gold || 0;
  const xpNeeded = level * 100;
  const progressPercent = Math.min((xp / xpNeeded) * 100, 100);

  const rpgStats = [
    { id: 'str', label: 'STR', name: 'Strength', val: profile?.str || 0, color: NEO.red, icon: 'arm-flex' },
    { id: 'vit', label: 'VIT', name: 'Vitality', val: profile?.vit || 0, color: NEO.green, icon: 'heart-pulse' },
    { id: 'cha', label: 'CHA', name: 'Charisma', val: profile?.cha || 0, color: NEO.orange, icon: 'star-face' },
    { id: 'int', label: 'INT', name: 'Intelligence', val: profile?.int || 0, color: NEO.blue, icon: 'brain' },
    { id: 'agi', label: 'AGI', name: 'Agility', val: profile?.agi || 0, color: NEO.seaBlue, icon: 'lightning-bolt' },
  ];

  const handleLogout = () => {
    logout();
    toast.info('Sampai jumpa! 👋', 'Kamu telah keluar dari akun.');
  };

  const getStatDescription = (stat) => {
    let highlight = '';
    let desc = '';
    switch(stat.id) {
      case 'str': highlight = 'Strength (Kekuatan Fisik)'; desc = 'Meningkatkan kebugaran tubuh dan daya tahan fisik.'; break;
      case 'int': highlight = 'Intelligence (Kecerdasan)'; desc = 'Kemampuan berpikir, fokus, dan mempelajari hal baru.'; break;
      case 'cha': highlight = 'Charisma (Karisma)'; desc = 'Keahlian bersosialisasi, komunikasi, dan kepemimpinan.'; break;
      case 'vit': highlight = 'Vitality (Vitalitas)'; desc = 'Kesehatan mental, istirahat yang cukup, dan kesejahteraan batin.'; break;
      case 'agi': highlight = 'Agility (Kelincahan)'; desc = 'Kecepatan, responsibilitas, dan kemampuan menyelesaikan tugas dengan cepat.'; break;
      default: return null;
    }
    return (
      <Text style={styles.modalDescText}>
        <Text style={{ backgroundColor: stat.color, color: NEO.white, fontWeight: '900' }}> {highlight} </Text> {desc}
      </Text>
    );
  };

  const getStatHowTo = (statId) => {
    switch(statId) {
      case 'str': return 'Selesaikan tugas seperti Workout, Angkat Beban, Lari, Push-up.';
      case 'int': return 'Selesaikan tugas seperti Membaca Buku, Belajar Coding, Mengerjakan PR.';
      case 'cha': return 'Selesaikan tugas seperti Berkumpul dengan Teman, Presentasi, Ngobrol.';
      case 'vit': return 'Selesaikan tugas seperti Meditasi, Tidur 8 Jam, Minum Air 2L.';
      case 'agi': return 'Selesaikan tugas seperti Bersih-bersih Cepat, Mencuci Baju, Berlari.';
      default: return '';
    }
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
          <NeoView innerStyle={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </NeoView>
          <View>
            <Text style={styles.haloText}>{t('halo')}</Text>
            <Text style={styles.nameText}>{firstName.toUpperCase()} 👋</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <NeoButton innerStyle={styles.iconBtn} onPress={() => handleFeaturePress('Shop 🛍️')}>
            <Ionicons name="bag-handle-outline" size={20} color={NEO.black} />
          </NeoButton>
          <NeoButton innerStyle={styles.iconBtn} onPress={() => handleFeaturePress('Trophy 🏆')}>
            <Ionicons name="trophy-outline" size={20} color={NEO.black} />
          </NeoButton>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* RPG STATS SECTION */}
        <View style={styles.rpgStatsContainer}>
          <View style={styles.rpgHeaderRow}>
            <NeoView innerStyle={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv. {level}</Text>
            </NeoView>
            <NeoView innerStyle={styles.goldBadge}>
              <Text style={styles.goldText}>{gold} 💰</Text>
            </NeoView>
          </View>

          <NeoView innerStyle={styles.hpBarContainer}>
            <View style={[styles.hpBarFill, { width: `${Math.max(0, Math.min(100, (hp / maxHp) * 100))}%` }]} />
            <View style={styles.barTextWrapper}>
              <Ionicons name="heart" size={12} color={NEO.black} style={styles.barIcon} />
              <Text style={styles.barText}>{Math.floor(hp)} / {maxHp} HP</Text>
            </View>
          </NeoView>

          <NeoView innerStyle={styles.expBarContainer}>
            <View style={[styles.xpBarFill, { width: `${progressPercent}%` }]} />
            <View style={styles.barTextWrapper}>
              <MaterialCommunityIcons name="sword-cross" size={14} color={NEO.black} style={styles.barIcon} />
              <Text style={styles.barText}>{xp} / {xpNeeded} XP</Text>
            </View>
          </NeoView>
        </View>

        {/* MASCOT CARD */}
        <NeoView style={{ marginBottom: 16 }} innerStyle={styles.mascotCard}>
          <View style={styles.mascotContentRow}>
          <Image
            source={require('../../assets/mascot.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <View style={styles.speechSection}>
            <NeoView innerStyle={styles.speechBubble}>
              <Text style={styles.speechTitle}>Hai {firstName}! 🌟</Text>
              <Text style={styles.speechText}>{t('startDayMascot')}</Text>
            </NeoView>
              <NeoButton
                innerStyle={styles.startBtn}
                onPress={() => navigation.navigate('Todo')}
              >
                <Text style={styles.startBtnText}>{t('startNow')}</Text>
              </NeoButton>
            </View>
          </View>
        </NeoView>

        {/* ATRIBUT KARAKTER (RPG STATS) */}
        <Text style={styles.sectionTitle}>ATRIBUT KARAKTER</Text>
        <NeoRadarChart data={rpgStats} onStatPress={(stat) => setSelectedStat(stat)} />

        {/* STATS SECTION */}
        <Text style={styles.sectionTitle}>{t('weeklyStats')}</Text>
        <NeoView style={{ marginBottom: 20 }} innerStyle={styles.statsCard}>
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
        </NeoView>

        {/* FEATURE CARDS */}
        <Text style={styles.sectionTitle}>{t('featuredHighlights')}</Text>
        <View style={styles.cardsGrid}>

          {/* Streak */}
          <NeoButton
            style={styles.featureCardWrapper}
            innerStyle={[styles.featureCardInner, { backgroundColor: NEO.seaBlue }]}
            onPress={() => handleFeaturePress('🔥 99 Days Streak')}
          >
            <MaterialCommunityIcons name="star-circle" size={30} color={NEO.white} />
            <Text style={styles.cardBig}>99 DAYS</Text>
            <Text style={styles.cardSub}>{t('streakSub')}</Text>
          </NeoButton>

          {/* Tugas */}
          <NeoButton
            style={styles.featureCardWrapper}
            innerStyle={[styles.featureCardInner, { backgroundColor: NEO.green }]}
            onPress={() => navigation.navigate('Todo')}
          >
            <MaterialCommunityIcons name="target" size={30} color={NEO.white} />
            <Text style={styles.cardBig}>80</Text>
            <Text style={styles.cardSub}>{t('tasksCompletedSub')}</Text>
          </NeoButton>

          {/* Daily Login */}
          <NeoButton
            style={styles.featureCardWrapper}
            innerStyle={[styles.featureCardInner, { backgroundColor: NEO.orange }]}
            onPress={() => handleFeaturePress('🎁 Hadiah Harian')}
          >
            <MaterialCommunityIcons name="calendar-check" size={30} color={NEO.white} />
            <Text style={styles.cardBig}>DAILY</Text>
            <Text style={styles.cardSub}>{t('dailyLoginSub')}</Text>
          </NeoButton>

          {/* Pet System */}
          <NeoButton
            style={styles.featureCardWrapper}
            innerStyle={[styles.featureCardInner, { backgroundColor: NEO.purple }]}
            onPress={() => handleFeaturePress('🐾 My Pet')}
          >
            <MaterialCommunityIcons name="cat" size={30} color={NEO.white} />
            <Text style={styles.cardBig}>LV. 5</Text>
            <Text style={styles.cardSub}>{t('petSub')}</Text>
          </NeoButton>

        </View>

        {/* CHAT PROMO */}
        <NeoButton onPress={() => { navigation.navigate('Chat'); }} style={{ marginTop: 4 }} innerStyle={styles.chatPromoCard}>
          <Image source={require('../../assets/mellisa.png')} style={styles.chatPromoAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.chatPromoTitle}>{t('chatPromoTitle')}</Text>
            <Text style={styles.chatPromoSub}>{t('chatPromoSub')}</Text>
          </View>
          <NeoView innerStyle={styles.chatArrow}>
            <Ionicons name="arrow-forward" size={18} color={NEO.black} />
          </NeoView>
        </NeoButton>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* NEO BOTTOM NAV */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => { navigation.navigate('Home'); }}>
          <View style={[styles.navIconWrapper, activeTab === 'home' && styles.navIconActive]}>
            <Ionicons name="home-outline" size={24} color={NEO.black} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => { navigation.navigate('Chat'); }}>
          <View style={[styles.navIconWrapper, activeTab === 'chat' && styles.navIconActive]}>
            <Ionicons name="chatbubble-outline" size={24} color={NEO.black} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.centerNavOuter}>
          <NeoButton 
            innerStyle={styles.centerNavBtn}
            onPress={() => navigation.navigate('CreateTodo')}
          >
            <Ionicons name="add" size={32} color={NEO.black} />
          </NeoButton>
        </View>

        <TouchableOpacity style={styles.navItem} onPress={() => { navigation.navigate('Guild'); }}>
          <View style={[styles.navIconWrapper, activeTab === 'social' && styles.navIconActive]}>
            <Ionicons name="people-outline" size={24} color={NEO.black} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => { navigation.navigate('Profile'); }}>
          <View style={[styles.navIconWrapper, activeTab === 'profile' && styles.navIconActive]}>
            <Ionicons name="settings-outline" size={24} color={NEO.black} />
          </View>
        </TouchableOpacity>
      </View>

      {/* STAT EXPLANATION MODAL */}
      <Modal
        visible={!!selectedStat}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedStat(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedStat(null)}>
          <Pressable onPress={() => {}} style={{ width: '85%', maxWidth: 400, alignItems: 'center' }}>
            <NeoView style={{ width: '100%' }} innerStyle={[styles.modalCard, selectedStat && { borderColor: NEO.black }]}>
            {selectedStat && (
              <>
                <NeoView innerStyle={[styles.modalIconBox, { backgroundColor: selectedStat.color }]}>
                  <MaterialCommunityIcons name={selectedStat.icon} size={40} color={NEO.white} />
                </NeoView>
                <Text style={styles.modalTitle}>{selectedStat.name}</Text>
                <Text style={styles.modalStatValue}>{selectedStat.val} Points</Text>
                
                <View style={styles.modalDivider} />
                
                <Text style={styles.modalDescTitle}>Tentang Atribut Ini:</Text>
                {getStatDescription(selectedStat)}
                
                <Text style={styles.modalDescTitle}>Cara Meningkatkan:</Text>
                <Text style={styles.modalDescText}>{getStatHowTo(selectedStat.id)}</Text>
              </>
            )}
          </NeoView>
          </Pressable>
        </Pressable>
      </Modal>
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

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  rpgStatsContainer: {
    marginBottom: 20,
  },
  rpgHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  levelBadge: {
    backgroundColor: NEO.yellow,
    borderWidth: 2,
    borderColor: NEO.black,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  levelBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.black,
  },

  goldBadge: {
    backgroundColor: NEO.white,
    borderWidth: 2,
    borderColor: NEO.black,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  goldText: {
    fontSize: 14,
    fontWeight: '900',
    color: NEO.black,
  },

  mascotCard: {
    backgroundColor: NEO.white,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'column',
    gap: 16,
    borderWidth: 2.5,
    borderColor: NEO.black,
  },
  mascotContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mascotExpBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: NEO.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: NEO.black,
    overflow: 'hidden',
  },
  xpBarFill: { backgroundColor: NEO.green, position: 'absolute', left: 0, top: 0, bottom: 0, borderRightWidth: 2.5, borderColor: NEO.black, borderRadius: 8 },
  hpBarContainer: {
    width: '100%',
    height: 24,
    backgroundColor: NEO.white,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: NEO.black,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 8,
  },
  hpBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FF4D4D',
    borderRightWidth: 2.5,
    borderColor: NEO.black,
    borderRadius: 8,
  },
  expBarContainer: {
    width: '100%',
    height: 24,
    backgroundColor: NEO.white,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: NEO.black,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  barTextWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barIcon: {
    marginRight: 4,
  },
  barText: {
    fontSize: 12,
    fontWeight: '900',
    color: NEO.black,
  },

  mascotImage: { width: 120, height: 170, marginLeft: -4 },
  speechSection: { flex: 1, gap: 10, paddingBottom: 4 },

  speechBubble: {
    backgroundColor: NEO.seaBlue,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    padding: 10,
  },
  speechTitle: { fontSize: 14, fontWeight: '900', color: NEO.black, marginBottom: 3 },
  speechText: { fontSize: 12, fontWeight: '600', color: NEO.black, lineHeight: 18 },

  startBtn: {
    backgroundColor: NEO.yellow,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  startBtnText: { fontSize: 11, fontWeight: '900', color: NEO.black, letterSpacing: 0.5 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 8,
    textTransform: 'uppercase', // Force uppercase for headers
  },

  // STATS

  modalCard: {
    backgroundColor: NEO.white,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    padding: 24,
    alignItems: 'center',
    width: '100%',
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
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 9, color: NEO.black, fontWeight: '800', textAlign: 'center' },

  // FEATURE CARDS
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  featureCardWrapper: {
    width: '48%',
    marginBottom: 14,
  },
  featureCardInner: {
    padding: 14,
    gap: 4,
    minHeight: 120,
  },
  cardBig: { fontSize: 16, fontWeight: '900', color: NEO.white, marginTop: 4 },
  cardSub: { fontSize: 11, fontWeight: '700', color: NEO.white },


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

  chatArrow: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconActive: {
    backgroundColor: NEO.green,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
  },
  centerNavOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    position: 'relative',
  },

  centerNavBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: NEO.green,
    borderWidth: 3,
    borderColor: NEO.black,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: "3px 3px 0px #0D0D0D, -3px 3px 0px #0D0D0D",
  },
  
  // STAT MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: NEO.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: NEO.black,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: NEO.black,
    marginTop: 4,
    marginBottom: 16,
  },
  modalDivider: {
    width: '100%',
    height: 2,
    backgroundColor: NEO.black,
    marginBottom: 16,
  },
  modalDescTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: NEO.black,
    width: '100%',
    textAlign: 'left',
    marginBottom: 4,
  },
  modalDescText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: '100%',
    textAlign: 'left',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalCloseBtnShadow: {
    width: '100%',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginTop: 10,
  },
  modalCloseBtn: {
    width: '100%',
    padding: 14,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: NEO.black,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.white,
  },
});

export default HomeScreen;
