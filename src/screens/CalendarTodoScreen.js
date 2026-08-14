import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  cyan: '#00FFE0',
  yellow: '#FFD043',
  green: '#00FF87',
};

const DATES = [
  { day: 'Senin', date: '07' },
  { day: 'Selasa', date: '08' },
  { day: 'Rabu', date: '09' },
  { day: 'Kamis', date: '10' },
  { day: 'Jumat', date: '11' },
  { day: 'Sabtu', date: '12' },
];

const SCHEDULE_ITEMS = [
  { time: '08:00', title: 'Tugas logika matematika', range: '08:00 - 08:30', color: NEO.cyan },
  { time: '18:00', title: 'Tugas analisis perancangan sistem', range: '18:00 - 18:40', color: NEO.cyan },
  { time: '20:00', title: 'Tugas matematika diskret', range: '20:00 - 21:40', color: NEO.yellow },
  { time: '22:00', title: 'Tugas algoritma dan struktur data', range: '22:00 - 22:35', color: NEO.cyan },
  { time: '23:00', title: 'Tugas Fisika', range: '23:00 - 23:35', color: NEO.cyan },
];

const CalendarTodoScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState('09');

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={NEO.black} />
        </TouchableOpacity>
      </View>

      {/* Month Name */}
      <Text style={styles.monthTitle}>Mei</Text>

      {/* Horizontal Date Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateSelectorScroll}
      >
        {DATES.map((item) => {
          const isSelected = selectedDate === item.date;
          return (
            <TouchableOpacity
              key={item.date}
              onPress={() => setSelectedDate(item.date)}
              activeOpacity={0.85}
            >
              <View style={[styles.dateCardShadow, isSelected && styles.dateCardSelectedShadow]}>
                <View style={[styles.dateCard, isSelected && styles.dateCardSelected]}>
                  <Text style={[styles.dateDayText, isSelected && styles.dateTextSelected]}>
                    {item.day}
                  </Text>
                  <Text style={[styles.dateNumText, isSelected && styles.dateTextSelected]}>
                    {item.date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Timeline Schedule */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.timelineContent, { paddingBottom: insets.bottom + 20 }]}
      >
        {SCHEDULE_ITEMS.map((item, index) => (
          <View key={index} style={styles.timelineRow}>
            {/* Time label */}
            <Text style={styles.timeLabel}>{item.time}</Text>

            {/* Connecting line indicator */}
            <View style={styles.lineDot} />

            {/* Task Card */}
            <View style={styles.taskCardShadow}>
              <View style={[styles.taskCard, { backgroundColor: item.color }]}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskRange}>{item.range}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </GridBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  backBtn: {
    padding: 2,
    alignSelf: 'flex-start',
  },
  monthTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: NEO.black,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  dateSelectorScroll: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 16,
  },
  dateCardShadow: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  dateCardSelectedShadow: {
    shadowOffset: { width: 3, height: 3 },
  },
  dateCard: {
    width: 68,
    height: 90,
    backgroundColor: NEO.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dateCardSelected: {
    backgroundColor: NEO.green,
  },
  dateDayText: {
    fontSize: 12,
    fontWeight: '800',
    color: NEO.black,
  },
  dateNumText: {
    fontSize: 20,
    fontWeight: '900',
    color: NEO.black,
  },
  dateTextSelected: {
    color: NEO.black,
  },
  timelineContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    width: 44,
  },
  lineDot: {
    width: 14,
    height: 2,
    backgroundColor: '#999',
  },
  taskCardShadow: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  taskCard: {
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: NEO.black,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  taskRange: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
});

export default CalendarTodoScreen;
