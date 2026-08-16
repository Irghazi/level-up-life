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
import { Ionicons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useToast } from '../components/Toast';
import NeoView from '../components/NeoView';
import NeoButton from '../components/NeoButton';
import NeoTextInput from '../components/NeoTextInput';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  green: '#00FF00', // Bright green as in image 2
  yellow: '#FFE500',
};

const CATEGORIES = [
  'Gaming & Esports',
  'Study & Productivity',
  'Fitness & Health',
  'Creative & Art',
  'Social & Fun',
];

const CreateGuildScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const [guildName, setGuildName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleCreateGuild = () => {
    if (!guildName.trim()) {
      toast.error('Nama Guild Kosong!', 'Mohon isi nama guild terlebih dahulu.');
      return;
    }

    const newGuild = {
      id: Date.now().toString(),
      name: guildName.trim().toUpperCase(),
      description: description.trim(),
      category: category || 'Social & Fun',
      icon: 'shield-outline',
      iconLib: 'Ionicons',
    };

    if (route.params?.onGuildCreated) {
      route.params.onGuildCreated(newGuild);
    }

    toast.success('Guild Dibuat! 🛡️', `Guild "${guildName.trim()}" berhasil dibuat.`);
    navigation.goBack();
  };

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NEO.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Guild</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* GUILD NAME */}
        <Text style={styles.label}>GUILD NAME</Text>
        <NeoTextInput
          style={{ marginBottom: 4 }}
          innerStyle={styles.input}
          placeholder="Enter an epic name..."
          placeholderTextColor="#AAA"
          value={guildName}
          onChangeText={setGuildName}
        />

        {/* DESCRIPTION */}
        <Text style={styles.label}>DESCRIPTION</Text>
        <NeoTextInput
          style={{ marginBottom: 4 }}
          innerStyle={[styles.input, styles.textArea]}
          placeholder="What is your guild about? Describe your rules, goals, and vibe."
          placeholderTextColor="#AAA"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        {/* CATEGORY */}
        <Text style={styles.label}>CATEGORY</Text>
        <NeoButton
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          innerStyle={styles.pickerBox}
        >
          <Text style={[styles.pickerText, !category && { color: '#AAA' }]}>
            {category || 'Select a category...'}
          </Text>
          <Ionicons
            name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={NEO.black}
          />
        </NeoButton>

        {/* Dropdown Options */}
        {showCategoryPicker && (
          <NeoView style={{ marginTop: 4 }} innerStyle={styles.dropdownBox}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.dropdownItem}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryPicker(false);
                }}
              >
                <Text style={[styles.dropdownItemText, category === cat && { fontWeight: '900' }]}>
                  {cat}
                </Text>
                {category === cat && <Ionicons name="checkmark" size={16} color={NEO.black} />}
              </TouchableOpacity>
            ))}
          </NeoView>
        )}

        <View style={{ height: 28 }} />

        {/* CREATE BUTTON */}
        <NeoButton
          style={{ marginBottom: 16 }}
          onPress={handleCreateGuild}
          innerStyle={styles.createBtn}
        >
          <Ionicons name="add-circle" size={20} color={NEO.black} />
          <Text style={styles.createBtnText}>CREATE</Text>
        </NeoButton>
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
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    color: NEO.black,
    marginTop: 10,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  inputShadow: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
    marginBottom: 4,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: NEO.black,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  pickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: NEO.black,
  },
  dropdownShadow: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
    marginTop: -2,
    marginBottom: 6,
  },
  dropdownBox: {
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: NEO.black,
  },
  createShadow: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    marginBottom: 10,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO.green,
    paddingVertical: 14,
    gap: 8,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.black,
    letterSpacing: 1,
  },
});

export default CreateGuildScreen;
