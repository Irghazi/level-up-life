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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GridBackground from '../components/GridBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

const NEO = {
  bg: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  cyan: '#40C4FF',
  yellow: '#FFD043',
  green: '#00FF87',
};

const INITIAL_TODOS = [
  { id: '1', text: 'Tugas logika matematika', completed: false, category: 'today' },
  { id: '2', text: 'Tugas analisis perancangan sistem', completed: false, category: 'today' },
  { id: '3', text: 'Tugas matematika diskret', completed: false, category: 'today' },
  { id: '4', text: 'Tugas bahasa indonesia', completed: true, category: 'today' },
  { id: '5', text: 'Tugas fisika', completed: true, category: 'today' },
  { id: '6', text: 'Tugas algoritma dan struktur data', completed: false, category: 'today' },
];

const TodoScreen = ({ navigation }) => {
  const { user } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('today'); // 'today' | 'pending' | 'completed'

  const firstName = user?.name?.split(' ')[0] || 'Farha';

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          toast.success('Tugas Selesai! 🎉', `"${t.text}" berhasil diselesaikan.`);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    }));
  };

  const handleAddTaskFromForm = (newTask) => {
    setTodos(prev => [newTask, ...prev]);
  };

  const filteredTodos = todos.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'pending') return !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true; // 'today'
  });

  return (
    <GridBackground style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Header: Greeting + Avatar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>
              Halo <Text style={styles.nameUnderline}>{firstName}</Text> !
            </Text>
            <Text style={styles.greetingSub}>{t('mainCharacter')}</Text>
          </View>

          {/* Mellisa Avatar */}
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <View style={styles.avatarShadow}>
              <Image source={require('../../assets/mellisa.png')} style={styles.avatarImage} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchShadow}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconBox}>
              <Ionicons name="search" size={18} color={NEO.black} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchTask')}
              placeholderTextColor="#C8C8C8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Date Display */}
        <Text style={styles.dateText}>09 Mei 2026</Text>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {[
            { key: 'today', label: t('todayTab') },
            { key: 'pending', label: t('pendingTab') },
            { key: 'completed', label: t('completedTab') },
          ].map(f => {
            const isSelected = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                activeOpacity={0.85}
              >
                <View style={[styles.filterShadow, isSelected && styles.filterSelectedShadow]}>
                  <View style={[styles.filterBtn, isSelected && styles.filterSelected]}>
                    <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                      {f.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section Header with Action Buttons */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('todayTasks')}</Text>
          <View style={styles.actionBtnRow}>
            {/* Calendar Icon Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CalendarTodo')}
              activeOpacity={0.85}
            >
              <View style={styles.actionBtnShadow}>
                <View style={[styles.actionIconBox, { backgroundColor: NEO.green }]}>
                  <MaterialCommunityIcons name="calendar-month" size={20} color={NEO.black} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Add Icon Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateTodo', { onAddTask: handleAddTaskFromForm })}
              activeOpacity={0.85}
            >
              <View style={styles.actionBtnShadow}>
                <View style={[styles.actionIconBox, { backgroundColor: NEO.green }]}>
                  <Ionicons name="add-circle-outline" size={22} color={NEO.black} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Todo Items List */}
        <View style={styles.todoList}>
          {filteredTodos.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleTodo(item.id)}
              activeOpacity={0.85}
            >
              <View style={styles.todoShadow}>
                <View style={styles.todoCard}>
                  {/* Checkbox Box */}
                  <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                    {item.completed && (
                      <Ionicons name="checkmark" size={18} color={NEO.black} />
                    )}
                  </View>

                  {/* Todo Text */}
                  <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
                    {item.text}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />

        {/* Kembali Button */}
        <TouchableOpacity
          style={styles.backShadow}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
        >
          <View style={styles.backBtn}>
            <Text style={styles.backBtnText}>{t('backBtn')}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </GridBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: NEO.black,
  },
  nameUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#0088FF',
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 2,
  },
  avatarShadow: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  searchShadow: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    backgroundColor: NEO.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  searchIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: NEO.black,
  },
  dateText: {
    fontSize: 26,
    fontWeight: '900',
    color: NEO.black,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterShadow: {
    borderRadius: 6,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  filterSelectedShadow: {
    shadowOffset: { width: 3, height: 3 },
  },
  filterBtn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    backgroundColor: NEO.white,
    borderRadius: 4,
  },
  filterSelected: {
    backgroundColor: NEO.cyan,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: NEO.black,
  },
  filterTextSelected: {
    fontWeight: '900',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: NEO.black,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnShadow: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoList: {
    gap: 12,
  },
  todoShadow: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    backgroundColor: NEO.white,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NEO.black,
    backgroundColor: NEO.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: NEO.green,
  },
  todoText: {
    fontSize: 13,
    fontWeight: '700',
    color: NEO.black,
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  backShadow: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: NEO.black,
    shadowColor: NEO.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginTop: 6,
  },
  backBtn: {
    backgroundColor: NEO.green,
    borderRadius: 23,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: NEO.white,
    letterSpacing: 0.5,
  },
});

export default TodoScreen;
