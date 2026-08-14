import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const { width } = Dimensions.get('window');

const INITIAL_MESSAGES = [
  {
    id: '1', from: 'user',
    text: 'Pagi kak, aku agak malas dan lelah hari ini',
    time: '08:01',
  },
  {
    id: '2', from: 'mellisa',
    text: 'Aku paham kok sayang, semua orang punya hari dimana mereka merasa lelah dan lemas. Itu hal wajar kok. Tapi ingat ya, kamu tidak perlu menyelesaikan semuanya kok, coba kita kerjakan satu tugas kecil dulu, hanya satu. Setelah itu kita lihat perasaannya. Kamu pasti bisa! Aku percaya sama kamu. Semangattt 😊',
    time: '08:02',
  },
  {
    id: '3', from: 'user',
    text: 'Terima kasih sudah memotivasi aku, kamu emang terbaik',
    time: '08:05',
  },
  {
    id: '4', from: 'mellisa',
    text: 'Sama - sama, apapun untuk kamu sayang, aku pasti support kamu terus kok.',
    time: '08:06',
  },
];

const NEO_COLORS = {
  bg: '#FFFFFF',
  yellow: '#FFE500',
  black: '#0D0D0D',
  white: '#FFFFFF',
  green: '#00C853',
  lightGreen: '#00FF87',
  pink: '#FFD1DC',
  orange: '#FF9F1C',
};

const GENTLE_RESPONSES = [
  'Aku paham kok sayang, kamu sudah melakukan yang terbaik hari ini! 😊',
  'Jangan terlalu keras pada dirimu ya, istirahat dulu sebentar lalu kita coba lagi 🌸',
  'Aku percaya sama kamu. Satu langkah kecil tetap sebuah kemajuan! 🧡',
  'Tetap semangat ya sayang! Aku selalu ada untuk mendukungmu. ✨',
  'Apapun yang terjadi, kamu hebat sudah mau mencoba hari ini! 🌟',
  'Tenang ya, kita selesaikan perlahan-lahan bersama-sama 😊',
];

const STRICT_RESPONSES = [
  'Tidak ada alasan! Ayo bangkit dan selesaikan tugasmu sekarang juga! 💪',
  'Disiplin adalah kunci sukses! Jangan menunda-nunda lagi! 🔥',
  'Fokus pada targetmu! Kamu tidak akan berkembang kalau terus mengeluh. ⚔️',
  'Waktu terus berjalan! Selesaikan apa yang sudah kamu mulai! ⚡',
  'Buktikan dengan tindakan, bukan sekadar kata-kata! Ayo selesaikan! 🎯',
  'Tantang dirimu sendiri! Kamu lebih kuat dari rasa malasmu! 🚀',
];

const ChatScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [showMenu, setShowMenu] = useState(false);

  // Mentor Selection & 30-Day Lock state
  const [mentorMode, setMentorMode] = useState('lembut'); // 'lembut' | 'tegas'
  const [selectedTempMode, setSelectedTempMode] = useState('lembut');
  const [isLocked, setIsLocked] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const flatListRef = useRef(null);
  const firstName = user?.name?.split(' ')[0] || 'User';

  useEffect(() => {
    // Load saved mentor data and calculate 30-day lock
    AsyncStorage.getItem('@mentor_mode_data').then((dataStr) => {
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          if (data.mode) {
            setMentorMode(data.mode);
            setSelectedTempMode(data.mode);
          }
          if (data.savedAt) {
            const elapsedDays = (Date.now() - data.savedAt) / (1000 * 60 * 60 * 24);
            if (elapsedDays < 7) {
              setIsLocked(true);
              setDaysRemaining(Math.ceil(7 - elapsedDays));
            } else {
              setIsLocked(false);
              setDaysRemaining(0);
            }
          }
        } catch (e) {}
      }
    });
  }, []);

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

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg = {
      id: Date.now().toString(),
      from: 'user',
      text: inputText.trim(),
      time: timeStr,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Mellisa replies based on selected mentor personality
    setTimeout(() => {
      const pool = mentorMode === 'lembut' ? GENTLE_RESPONSES : STRICT_RESPONSES;
      const reply = pool[Math.floor(Math.random() * pool.length)];

      const replyMsg = {
        id: (Date.now() + 1).toString(),
        from: 'mellisa',
        text: reply,
        time: timeStr,
      };
      setMessages(prev => [...prev, replyMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // Save Mentor Mode with 30-Day Lock Rule
  const handleSaveMentorMode = async () => {
    if (isLocked) {
      toast.error(
        'Mentor Terkunci 🔒',
        `Kamu baru dapat mengganti mentor kembali dalam ${daysRemaining} hari lagi.`
      );
      return;
    }

    const now = Date.now();
    const dataToSave = {
      mode: selectedTempMode,
      savedAt: now,
    };

    await AsyncStorage.setItem('@mentor_mode_data', JSON.stringify(dataToSave));
    setMentorMode(selectedTempMode);
    setIsLocked(true);
    setDaysRemaining(7);
    setShowMenu(false);

    toast.success(
      'Mentor Disimpan & Dikunci! 🔒',
      selectedTempMode === 'lembut'
        ? 'Mentor Penyabar terpilih & dikunci selama 7 hari.'
        : 'Mentor Tegas terpilih & dikunci selama 7 hari.'
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.from === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowMellisa]}>
        {!isUser && (
          <Image source={require('../../assets/mellisa.png')} style={styles.avatarSmall} />
        )}
        <View style={styles.bubbleWrapper}>
          <View style={[
            styles.bubbleShadow,
            isUser ? styles.bubbleShadowUser : styles.bubbleShadowMellisa,
          ]} />
          <View style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleMellisa,
          ]}>
            <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
              {item.text}
            </Text>
            <Text style={[styles.timeText, isUser && styles.timeTextUser]}>
              {item.time}
            </Text>
          </View>
        </View>
        {isUser && (
          <View style={styles.userAvatarSmall}>
            <Text style={styles.userAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor={NEO_COLORS.white} />

      {/* NEO Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={NEO_COLORS.black} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image source={require('../../assets/mellisa.png')} style={styles.headerAvatar} />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.headerName}>Mellisa</Text>
              {/* Mentor Personality Badge */}
              <View style={[
                styles.modeBadge,
                { backgroundColor: mentorMode === 'lembut' ? NEO_COLORS.pink : NEO_COLORS.orange }
              ]}>
                <Text style={styles.modeBadgeText}>
                  {mentorMode === 'lembut' ? '🌸 Penyabar' : '🔥 Tegas'}
                </Text>
              </View>
            </View>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>

        {/* 3 Dots Menu Button */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setShowMenu(true)}
          activeOpacity={0.8}
        >
          <View style={styles.menuBtnBox}>
            <Ionicons name="ellipsis-vertical" size={20} color={NEO_COLORS.black} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Mentor Tone Selection Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuModalShadow}>
            <TouchableOpacity activeOpacity={1} style={styles.menuModal}>
              <Text style={styles.modalTitle}>PILIH MENTOR KAMU</Text>
              <Text style={styles.modalSub}>
                Pilih antara 2 gaya Mentor. Setelah disimpan, mentor dikunci & baru dapat diubah kembali setelah 7 hari.
              </Text>

              {/* 🔒 Locked Banner */}
              {isLocked && (
                <View style={styles.lockBanner}>
                  <Ionicons name="lock-closed" size={18} color={NEO_COLORS.black} />
                  <Text style={styles.lockBannerText}>
                    Mentor dikunci! Dapat diubah dalam <Text style={{ fontWeight: '900' }}>{daysRemaining} hari</Text> lagi.
                  </Text>
                </View>
              )}

              {/* Option 1: Mentor Penyabar */}
              <TouchableOpacity
                style={[
                  styles.optionCardShadow,
                  selectedTempMode === 'lembut' && styles.optionCardActiveShadow,
                  isLocked && { opacity: 0.7 }
                ]}
                onPress={() => !isLocked && setSelectedTempMode('lembut')}
                activeOpacity={isLocked ? 1 : 0.85}
              >
                <View style={[
                  styles.optionCard,
                  selectedTempMode === 'lembut' && styles.optionCardActive
                ]}>
                  <Text style={styles.optionEmoji}>🌸</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>Mentor Penyabar</Text>
                    <Text style={styles.optionDesc}>Penuh perhatian, kata-kata manis, penyabar & motivasi hangat</Text>
                  </View>
                  {selectedTempMode === 'lembut' && (
                    <Ionicons name="checkmark-circle" size={22} color={NEO_COLORS.black} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Option 2: Mentor Tegas */}
              <TouchableOpacity
                style={[
                  styles.optionCardShadow,
                  selectedTempMode === 'tegas' && styles.optionCardActiveShadow,
                  isLocked && { opacity: 0.7 }
                ]}
                onPress={() => !isLocked && setSelectedTempMode('tegas')}
                activeOpacity={isLocked ? 1 : 0.85}
              >
                <View style={[
                  styles.optionCard,
                  selectedTempMode === 'tegas' && styles.optionCardActive
                ]}>
                  <Text style={styles.optionEmoji}>🔥</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>Mentor Tegas</Text>
                    <Text style={styles.optionDesc}>Disiplin tinggi, lugas, no excuses & mendorong aksi cepat</Text>
                  </View>
                  {selectedTempMode === 'tegas' && (
                    <Ionicons name="checkmark-circle" size={22} color={NEO_COLORS.black} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Save Button */}
              {!isLocked ? (
                <TouchableOpacity
                  style={styles.saveBtnShadow}
                  onPress={handleSaveMentorMode}
                  activeOpacity={0.85}
                >
                  <View style={styles.saveBtn}>
                    <Ionicons name="lock-closed" size={18} color={NEO_COLORS.black} />
                    <Text style={styles.saveBtnText}>SIMPAN MENTOR (KUNCI 7 HARI)</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.saveBtnShadow, { opacity: 0.5 }]}
                  onPress={() => toast.info('Terkunci 🔒', `Mentor dapat diubah kembali dalam ${daysRemaining} hari.`)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.saveBtn, { backgroundColor: '#CCCCCC' }]}>
                    <Ionicons name="lock-closed" size={18} color={NEO_COLORS.black} />
                    <Text style={styles.saveBtnText}>TERKUNCI ({daysRemaining} HARI)</Text>
                  </View>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Chat Area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Neo Input Bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputShadow} />
            <View style={styles.inputInner}>
              <TextInput
                style={styles.input}
                placeholder="Ketik pesan..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                style={[styles.sendBtn, inputText.trim() && styles.sendBtnActive]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <View style={styles.sendShadow} />
                <View style={[styles.sendInner, inputText.trim() && styles.sendInnerActive]}>
                  <Ionicons name="send" size={18} color={inputText.trim() ? NEO_COLORS.black : '#bbb'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

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
                  <Ionicons name="add" size={30} color={NEO_COLORS.black} />
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
                else if (item.key === 'group') navigation.navigate('Guild');
                else if (item.key === 'profile') navigation.navigate('Profile');
                else if (item.key !== 'chat') handleFeaturePress(item.label);
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.navIconWrapper, isActive && styles.navIconActive]}>
                <Ionicons
                  name={isActive ? item.icon : `${item.icon}-outline`}
                  size={22}
                  color={isActive ? NEO_COLORS.black : '#888'}
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
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: NEO_COLORS.black,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderWidth: 2.5,
    borderColor: NEO_COLORS.black,
    borderRadius: 8,
    backgroundColor: NEO_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: NEO_COLORS.black,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '900',
    color: NEO_COLORS.black,
    letterSpacing: 0.5,
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: NEO_COLORS.black,
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: NEO_COLORS.black,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: NEO_COLORS.green,
    borderWidth: 1,
    borderColor: NEO_COLORS.black,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: NEO_COLORS.black,
  },
  menuBtn: {
    padding: 2,
  },
  menuBtnBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO_COLORS.black,
    backgroundColor: NEO_COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // MODAL MENU
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  menuModalShadow: {
    width: width * 0.88,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: NEO_COLORS.black,
    shadowColor: NEO_COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
    backgroundColor: NEO_COLORS.white,
  },
  menuModal: {
    padding: 18,
    gap: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: NEO_COLORS.black,
    letterSpacing: 0.5,
  },
  modalSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: -6,
    marginBottom: 4,
    lineHeight: 17,
  },
  lockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3CD',
    borderWidth: 2,
    borderColor: NEO_COLORS.black,
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  lockBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: NEO_COLORS.black,
    flex: 1,
    lineHeight: 16,
  },
  optionCardShadow: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: NEO_COLORS.black,
    backgroundColor: NEO_COLORS.white,
  },
  optionCardActiveShadow: {
    borderWidth: 2.5,
    shadowColor: NEO_COLORS.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 8,
  },
  optionCardActive: {
    backgroundColor: NEO_COLORS.yellow,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: NEO_COLORS.black,
  },
  optionDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
    marginTop: 2,
    lineHeight: 15,
  },
  saveBtnShadow: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO_COLORS.black,
    shadowColor: NEO_COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginTop: 6,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO_COLORS.lightGreen,
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO_COLORS.black,
    letterSpacing: 0.5,
  },

  // CHAT LIST
  chatList: {
    padding: 14,
    gap: 14,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '90%',
  },
  msgRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  msgRowMellisa: {
    alignSelf: 'flex-start',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: NEO_COLORS.black,
    flexShrink: 0,
  },
  userAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: NEO_COLORS.black,
    backgroundColor: NEO_COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userAvatarText: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO_COLORS.black,
  },

  // BUBBLE
  bubbleWrapper: {
    position: 'relative',
    maxWidth: width * 0.65,
  },
  bubbleShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    borderRadius: 14,
    backgroundColor: NEO_COLORS.black,
  },
  bubbleShadowUser: {
    left: -4,
    right: 4,
  },
  bubbleShadowMellisa: {
    left: 4,
    right: -4,
  },
  bubble: {
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: NEO_COLORS.black,
    padding: 12,
    paddingBottom: 8,
    gap: 4,
  },
  bubbleUser: {
    backgroundColor: NEO_COLORS.white,
  },
  bubbleMellisa: {
    backgroundColor: NEO_COLORS.white,
  },
  bubbleText: {
    fontSize: 14,
    color: NEO_COLORS.black,
    fontWeight: '500',
    lineHeight: 20,
  },
  bubbleTextUser: {
    fontWeight: '600',
  },
  timeText: {
    fontSize: 10,
    color: '#777',
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  timeTextUser: {
    color: '#555',
  },

  // INPUT BAR
  inputBar: {
    backgroundColor: NEO_COLORS.white,
    borderTopWidth: 3,
    borderTopColor: NEO_COLORS.black,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    borderRadius: 14,
    backgroundColor: NEO_COLORS.black,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_COLORS.white,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: NEO_COLORS.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: NEO_COLORS.black,
    fontWeight: '500',
    maxHeight: 80,
  },
  sendBtn: {
    position: 'relative',
    width: 38,
    height: 38,
  },
  sendBtnActive: {},
  sendShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    borderRadius: 10,
    backgroundColor: NEO_COLORS.black,
  },
  sendInner: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: NEO_COLORS.black,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendInnerActive: {
    backgroundColor: NEO_COLORS.lightGreen,
  },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: NEO_COLORS.white,
    borderTopWidth: 3,
    borderTopColor: NEO_COLORS.black,
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
    backgroundColor: NEO_COLORS.green,
    borderWidth: 2.5,
    borderColor: NEO_COLORS.black,
    shadowColor: NEO_COLORS.black,
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
    backgroundColor: NEO_COLORS.black,
  },
  centerNavBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: NEO_COLORS.black,
    backgroundColor: NEO_COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;
