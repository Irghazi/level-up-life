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

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  cyan: '#40C4FF',
  green: '#00FF87',
  gray: '#F0F0F0',
};

const PRIORITIES = ['Deadline mepet', 'Sangat penting', 'Penting', 'Opsional'];
const DIFFICULTIES = ['Mudah', 'Menengah', 'Sulit'];

const CreateTodoScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('Deadline mepet');
  const [difficulty, setDifficulty] = useState('Sulit');

  const handleCreateTask = () => {
    if (!title.trim()) {
      toast.error('Judul Kosong!', 'Mohon isi judul tugas terlebih dahulu.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: title.trim(),
      date: date.trim() || '09 Mei 2026',
      time: startTime && endTime ? `${startTime} - ${endTime}` : '08:00 - 08:30',
      notes: notes.trim(),
      priority,
      difficulty,
      completed: false,
    };

    // If route has callback onAddTask
    if (route.params?.onAddTask) {
      route.params.onAddTask(newTask);
    }

    toast.success('Tugas Dibuat! 🎉', `"${title.trim()}" berhasil ditambahkan.`);
    navigation.goBack();
  };

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={NEO.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tugas Baru</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Judul */}
        <Text style={styles.labelUnderline}>Judul</Text>
        <View style={styles.inputShadow}>
          <TextInput
            style={styles.input}
            placeholder="Ketik judul"
            placeholderTextColor="#C8C8C8"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Tanggal */}
        <Text style={styles.label}>Tanggal</Text>
        <View style={styles.inputShadow}>
          <TextInput
            style={styles.input}
            placeholder="Ketik Tanggal"
            placeholderTextColor="#C8C8C8"
            value={date}
            onChangeText={setDate}
          />
        </View>

        {/* Waktu */}
        <Text style={styles.label}>Waktu</Text>
        <View style={styles.timeRow}>
          <View style={[styles.inputShadow, { flex: 1 }]}>
            <TextInput
              style={styles.input}
              placeholder="Ketik waktu mulai"
              placeholderTextColor="#C8C8C8"
              value={startTime}
              onChangeText={setStartTime}
            />
          </View>
          <View style={[styles.inputShadow, { flex: 1 }]}>
            <TextInput
              style={styles.input}
              placeholder="waktu selesai"
              placeholderTextColor="#C8C8C8"
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>
        </View>

        {/* Catatan */}
        <Text style={styles.label}>Catatan</Text>
        <View style={styles.inputShadow}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ketik catatan disini"
            placeholderTextColor="#C8C8C8"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Prioritas */}
        <Text style={styles.label}>Prioritas</Text>
        <View style={styles.chipGrid}>
          {PRIORITIES.map((p) => {
            const isSelected = priority === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                activeOpacity={0.85}
              >
                <View style={[styles.chipShadow, isSelected && styles.chipSelectedShadow]}>
                  <View style={[styles.chip, isSelected && styles.chipSelected]}>
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {p}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tingkat kesulitan tugas */}
        <Text style={styles.label}>Tingkat kesulitan tugas</Text>
        <View style={styles.chipRow}>
          {DIFFICULTIES.map((d) => {
            const isSelected = difficulty === d;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => setDifficulty(d)}
                activeOpacity={0.85}
                style={{ flex: 1 }}
              >
                <View style={[styles.chipShadow, isSelected && styles.chipSelectedShadow]}>
                  <View style={[styles.chip, isSelected && styles.chipSelected]}>
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {d}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 24 }} />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitShadow}
          onPress={handleCreateTask}
          activeOpacity={0.85}
        >
          <View style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Buat tugas</Text>
          </View>
        </TouchableOpacity>
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
    paddingTop: 10,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.black,
    marginTop: 12,
    marginBottom: 4,
  },
  labelUnderline: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.black,
    marginTop: 6,
    marginBottom: 4,
    textDecorationLine: 'underline',
    textDecorationColor: '#0088FF',
  },
  inputShadow: {
    backgroundColor: NEO.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
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
    minHeight: 60,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 14,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chipShadow: {
    borderRadius: 6,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  chipSelectedShadow: {
    shadowOffset: { width: 3, height: 3 },
  },
  chip: {
    backgroundColor: NEO.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: NEO.cyan,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: NEO.black,
  },
  chipTextSelected: {
    fontWeight: '900',
  },
  submitShadow: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginTop: 10,
  },
  submitBtn: {
    backgroundColor: NEO.green,
    borderRadius: 23,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: NEO.white,
    letterSpacing: 0.5,
  },
});

export default CreateTodoScreen;
