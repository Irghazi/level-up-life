import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';
import NeoView from '../components/NeoView';
import NeoButton from '../components/NeoButton';
import NeoTextInput from '../components/NeoTextInput';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  yellow: '#FFE500',
  green: '#00C853',
};

const INITIAL_GUILDS = [
  { id: '1', name: 'SHADOW STRIKERS', icon: 'sword-cross', iconLib: 'MaterialCommunityIcons' },
  { id: '2', name: 'IRON DEFENDERS', icon: 'shield-outline', iconLib: 'Ionicons' },
  { id: '3', name: 'LIGHTNING CLAN', icon: 'flash', iconLib: 'Ionicons' },
  { id: '4', name: 'INFERNO SQUAD', icon: 'fire', iconLib: 'MaterialCommunityIcons' },
];

const GuildScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [guilds, setGuilds] = useState(INITIAL_GUILDS);
  const [searchQuery, setSearchQuery] = useState('');
  const activeTab = 'group';

  const firstName = user?.name?.split(' ')[0] || 'USER';

  const handleLogout = () => {
    logout();
    toast.info('Sampai jumpa! 👋', 'Kamu telah keluar dari akun.');
  };

  const handleFeaturePress = (name) => {
    toast.info(`${name}`, 'Fitur ini segera hadir!');
  };

  const handleJoinGuild = (name) => {
    toast.success('Join Guild! ⚔️', `Kamu telah mengajukan bergabung ke ${name}.`);
  };

  const filteredGuilds = guilds.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'chat', icon: 'chatbubble-ellipses', label: 'Chat' },
    { key: 'add', icon: 'add', label: '', isCenter: true },
    { key: 'group', icon: 'people', label: 'Grup' },
    { key: 'profile', icon: 'settings', label: 'Profil' },
  ];

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <NeoView innerStyle={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </NeoView>
          <View>
            <Text style={styles.haloText}>HALO</Text>
            <Text style={styles.nameText}>{firstName.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <NeoButton innerStyle={styles.iconBtn} onPress={() => handleFeaturePress('Shop')}>
            <Ionicons name="bag-handle-outline" size={20} color={NEO.black} />
          </NeoButton>
          <NeoButton innerStyle={styles.iconBtn} onPress={() => handleFeaturePress('Trophy')}>
            <Ionicons name="trophy-outline" size={20} color={NEO.black} />
          </NeoButton>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Section */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>{t('guildTitle')}</Text>
            <Text style={styles.subtitle}>{t('guildSub')}</Text>
          </View>


        </View>

        <NeoTextInput
          style={{ marginBottom: 20 }}
          innerStyle={styles.searchBar}
          placeholder={t('searchGuild')}
          placeholderTextColor="#C8C8C8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
          <NeoButton
            onPress={() => navigation.navigate('CreateGuild', {
              onGuildCreated: (newG) => setGuilds(prev => [newG, ...prev])
            })}
            innerStyle={styles.createGuildBtn}
          >
            <Ionicons name="add" size={18} color={NEO.black} />
            <Text style={styles.createGuildText}>{t('createGuildBtn')}</Text>
          </NeoButton>
        </View>

        {/* Recommended Section Title */}
        <View style={styles.sectionHeader}>
          <View style={styles.dotGreen} />
          <Text style={styles.sectionTitle}>{t('recommendedGuilds')}</Text>
        </View>

        {/* Guild Cards List */}
        <View style={styles.guildList}>
          {filteredGuilds.map((item) => (
            <NeoButton
              key={item.id}
              onPress={() => handleJoinGuild(item.name)}
              style={{ marginBottom: 12 }}
              innerStyle={styles.guildCard}
            >
              {/* Guild Icon Box */}
              <View style={styles.guildIconBox}>
                {item.iconLib === 'MaterialCommunityIcons' ? (
                  <MaterialCommunityIcons name={item.icon} size={22} color={NEO.black} />
                ) : (
                  <Ionicons name={item.icon} size={22} color={NEO.black} />
                )}
              </View>

              {/* Guild Name */}
              <Text style={styles.guildName}>{item.name}</Text>

              {/* Chevron Right */}
              <Ionicons name="chevron-forward" size={20} color={NEO.black} />
            </NeoButton>
          ))}
        </View>

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
                else if (item.key === 'profile') navigation.navigate('Profile');
                else if (item.key !== 'group') handleFeaturePress(item.label);
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
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    marginTop: 4,
    lineHeight: 18,
  },

  createGuildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO.yellow,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  createGuildText: {
    fontSize: 12,
    fontWeight: '900',
    color: NEO.black,
  },
  searchShadow: {
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: NEO.white,
    borderRadius: 8,
  },
  searchIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchBtn: { width: 48, height: 48, backgroundColor: NEO.yellow, borderRadius: 8, borderWidth: 2, borderColor: NEO.black, alignItems: 'center', justifyContent: 'center' },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: NEO.black,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 8,
    backgroundColor: NEO.green,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
  },
  guildList: {
    gap: 12,
  },
  guildCardShadow: {
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.yellow,
  },
  guildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    backgroundColor: NEO.yellow,
    borderRadius: 8,
  },
  guildIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guildName: {
    fontSize: 14,
    fontWeight: '900',
    color: NEO.black,
    flex: 1,
    letterSpacing: 0.5,
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

export default GuildScreen;
