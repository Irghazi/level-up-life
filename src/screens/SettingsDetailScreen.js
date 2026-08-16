import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  yellow: '#FFE500',
};

const SettingsDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const title = route.params?.title || 'SETTINGS';

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NEO.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.content}>
        {/* Empty State Card */}
        <View style={styles.cardShadow}>
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="construct-outline" size={36} color={NEO.black} />
            </View>
            <Text style={styles.emptyTitle}>Halaman Masih Kosong</Text>
            <Text style={styles.emptySub}>
              Fitur {title} sedang dalam pengembangan dan akan segera hadir!
            </Text>
            <TouchableOpacity
              style={styles.backBtnShadow}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <View style={styles.backBtnInner}>
                <Text style={styles.backBtnText}>KEMBALI</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  cardShadow: {
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: NEO.black,
    boxShadow: '2px 2px 0px #0D0D0D',
    backgroundColor: NEO.white,
  },
  card: {
    alignItems: 'center',
    padding: 24,
    gap: 10,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: NEO.black,
    backgroundColor: NEO.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: NEO.black,
  },
  emptySub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 10,
  },
  backBtnShadow: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    boxShadow: '2px 2px 0px #0D0D0D',
  },
  backBtnInner: {
    backgroundColor: NEO.yellow,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
  },
});

export default SettingsDetailScreen;
