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
  yellow: '#FFE500',
  green: '#00FF00',
};

const LANGUAGES = [
  {
    id: 'id',
    name: 'Bahasa Indonesia',
    sub: 'Indonesian',
    flag: '🇮🇩',
  },
  {
    id: 'en',
    name: 'English',
    sub: 'Inggris',
    flag: '🇬🇧',
  },
];

const LanguageScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { lang, changeLanguage, t } = useLanguage();

  const handleSelectLanguage = async (l) => {
    await changeLanguage(l.id);
    toast.success(t('langChangedToast'), `${l.name}`);
  };

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NEO.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        <Text style={styles.sectionTitle}>{t('selectLanguageTitle')}</Text>
        <Text style={styles.sectionSub}>{t('availableLanguagesSub')}</Text>

        <View style={styles.itemsList}>
          {LANGUAGES.map((item) => {
            const isSelected = lang === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectLanguage(item)}
                activeOpacity={0.85}
              >
                <View style={[styles.cardShadow, isSelected && styles.cardSelectedShadow]}>
                  <View style={[styles.card, isSelected && styles.cardSelected]}>
                    {/* Flag */}
                    <Text style={styles.flagText}>{item.flag}</Text>

                    {/* Name */}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.langName}>{item.name}</Text>
                      <Text style={styles.langSub}>{item.sub}</Text>
                    </View>

                    {/* Checkmark */}
                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={16} color={NEO.black} />
                      </View>
                    )}
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
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
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
  cardSelectedShadow: {
    shadowOffset: { width: 4, height: 4 },
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderRadius: 2,
  },
  cardSelected: {
    backgroundColor: NEO.yellow,
  },
  flagText: {
    fontSize: 28,
  },
  langName: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.black,
  },
  langSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LanguageScreen;
