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
import { ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GridBackground from '../components/GridBackground';
import { useToast } from '../components/Toast';
import NeoView from '../components/NeoView';
import NeoButton from '../components/NeoButton';
import NeoTextInput from '../components/NeoTextInput';
import { aiService } from '../services/aiService';

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
const STATS_CATEGORIES = ['STR', 'INT', 'CHA', 'VIT', 'AGI'];

const CreateTodoScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState(null); // Unselected by default
  const [difficulty, setDifficulty] = useState(null); // Unselected by default
  const [category, setCategory] = useState(null); // Unselected by default
  const [isDetecting, setIsDetecting] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerType, setPickerType] = useState('start');

  // Auto-detect effect
  React.useEffect(() => {
    // Only detect if title is long enough
    if (!title || title.trim().length < 3) return;

    const timerId = setTimeout(async () => {
      setIsDetecting(true);
      const result = await aiService.analyzeTask(title.trim());
      
      setIsDetecting(false);
      
      if (result.isAnomaly) {
        toast.error('Peringatan Anomali!', result.anomalyReason || 'Judul tugas tidak masuk akal atau merugikan.');
      } else if (result.category) {
        setCategory(result.category);
        toast.success('Kategori Otomatis 🪄', `Tugasmu terdeteksi sebagai aktivitas ${result.category}`);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timerId);
  }, [title]);

  const handleCreateTask = () => {
    if (!title.trim()) {
      toast.error('Judul Kosong!', 'Mohon isi judul tugas terlebih dahulu.');
      return;
    }
    
    if (!priority) {
      toast.error('Prioritas Kosong!', 'Mohon pilih prioritas tugas terlebih dahulu.');
      return;
    }

    if (!difficulty) {
      toast.error('Kesulitan Kosong!', 'Mohon pilih tingkat kesulitan tugas terlebih dahulu.');
      return;
    }

    if (!category) {
      toast.error('Kategori Kosong!', 'Mohon pilih kategori tugas terlebih dahulu.');
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
      category,
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
        <View style={styles.titleRow}>
          <Text style={styles.labelUnderline}>Judul</Text>
          {isDetecting && (
            <ActivityIndicator size="small" color={NEO.black} style={{ marginLeft: 10 }} />
          )}
        </View>
        <NeoTextInput
          style={{ marginBottom: 4 }}
          innerStyle={styles.input}
          placeholder="Ketik judul"
          placeholderTextColor="#C8C8C8"
          value={title}
          onChangeText={setTitle}
        />

        {/* Kategori RPG */}
        <Text style={styles.label}>Kategori (Status RPG)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {STATS_CATEGORIES.map(cat => (
            <NeoButton
              key={cat}
              onPress={() => setCategory(cat)}
              innerStyle={[styles.chip, category === cat && styles.chipSelected]}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>
                {cat}
              </Text>
            </NeoButton>
          ))}
        </ScrollView>

        {/* Tanggal */}
        <Text style={styles.label}>Tanggal</Text>
        <NeoTextInput
          style={{ marginBottom: 4 }}
          innerStyle={styles.input}
          placeholder="Ketik Tanggal"
          placeholderTextColor="#C8C8C8"
          value={date}
          onChangeText={setDate}
        />

        {/* Waktu */}
        <Text style={styles.label}>Waktu</Text>
        <View style={styles.timeRow}>
          <NeoButton
            style={{ flex: 1 }}
            innerStyle={styles.timeInputBtn}
            onPress={() => { setPickerType('start'); setShowTimePicker(true); }}
          >
            <Text style={[styles.timeInputText, !startTime && { color: '#C8C8C8' }]}>
              {startTime || 'Waktu mulai'}
            </Text>
          </NeoButton>
          
          <NeoButton
            style={{ flex: 1 }}
            innerStyle={styles.timeInputBtn}
            onPress={() => { setPickerType('end'); setShowTimePicker(true); }}
          >
            <Text style={[styles.timeInputText, !endTime && { color: '#C8C8C8' }]}>
              {endTime || 'Waktu selesai'}
            </Text>
          </NeoButton>
        </View>

        {/* Catatan */}
        <Text style={styles.label}>Catatan</Text>
        <NeoTextInput
          style={{ marginBottom: 4 }}
          innerStyle={[styles.input, styles.textArea]}
          placeholder="Ketik catatan disini"
          placeholderTextColor="#C8C8C8"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        {/* Prioritas */}
        <Text style={styles.label}>Prioritas</Text>
        <View style={styles.chipGrid}>
          {PRIORITIES.map((p) => {
            const isSelected = priority === p;
            return (
              <NeoButton
                key={p}
                onPress={() => setPriority(p)}
                innerStyle={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {p}
                </Text>
              </NeoButton>
            );
          })}
        </View>

        {/* Tingkat kesulitan tugas */}
        <Text style={styles.label}>Tingkat kesulitan tugas</Text>
        <View style={styles.chipRow}>
          {DIFFICULTIES.map((d) => {
            const isSelected = difficulty === d;
            return (
              <NeoButton
                key={d}
                onPress={() => setDifficulty(d)}
                style={{ flex: 1 }}
                innerStyle={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {d}
                </Text>
              </NeoButton>
            );
          })}
        </View>

        <View style={{ height: 24 }} />

        {/* Submit Button */}
        <NeoButton
          style={{ marginBottom: 16 }}
          onPress={handleCreateTask}
          innerStyle={styles.submitBtn}
        >
          <Text style={styles.submitBtnText}>Buat tugas</Text>
        </NeoButton>
      </ScrollView>

      {/* DateTime Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              const hours = selectedDate.getHours().toString().padStart(2, '0');
              const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
              const timeString = `${hours}:${minutes}`;
              
              if (pickerType === 'start') {
                setStartTime(timeString);
              } else {
                setEndTime(timeString);
              }
            }
          }}
        />
      )}
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
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: NEO.black,
    backgroundColor: NEO.white,
    borderRadius: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 4,
  },
  chipScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 14,
  },
  timeInputBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: NEO.white,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 46,
  },
  timeInputText: {
    fontSize: 14,
    fontWeight: '600',
    color: NEO.black,
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
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
  },
  chip: {
    backgroundColor: NEO.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 6,
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
    color: NEO.black,
    letterSpacing: 0.5,
  },
});

export default CreateTodoScreen;
